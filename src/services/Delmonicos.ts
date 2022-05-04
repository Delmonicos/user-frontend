import {
  ApiPromise,
  WsProvider,
} from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { Tuple } from '@polkadot/types';
import { Buffer } from 'buffer';

import KeyringService from "../services/Keyring";
import Charger from "../models/Charger";
import config from "../config.json";
import ChargeRequest from '../models/ChargeRequest';
import ChargeSession from '../models/ChargeSession';

class DelmonicosService {

  private api: ApiPromise | null = null;

  async connect() {
    const wsProvider = new WsProvider(config.wsEndpoint);
    this.api = await ApiPromise.create({
      provider: wsProvider,
      types: {
        Attribute: {
          name: 'Vec<u8>',
          value: 'Vec<u8>',
          validity: 'BlockNumber',
          creation: 'Moment',
          nonce: 'u64',
        },
        PaymentConsent: {
          timestamp: 'Moment',
          iban: 'Vec<u8>',
          bic_code: 'Vec<u8>',
          signature: 'Vec<u8>',
        },
        ChargingSession: {
          user_id: 'AccountId',
          started_at: 'Moment',
          session_id: 'Hash',
        },
        ChargeRequest: {
          user_id: 'AccountId',
          created_at: 'Moment',
          session_id: 'Hash',
        },
      },
    });
  }

  private async getApi(): Promise<ApiPromise> {
    if (this.api !== null) return this.api;
    await this.connect();
    return this.api!;
  }

  async getChargers(): Promise<Charger[]> {
    const api = await this.getApi();
    const members = await api.query.registrar.membersOf(config.chargersOrganization) as unknown as any[];
    const chargersId = members.map((value) => value.toString());

    const chargersWithNonces = await Promise.all(
      chargersId.map((chargerId: string) => {
        return this.api!.query.did
          .attributeNonce(
            [
              chargerId,
              'location',
            ]
          )
          .then((nonce: any) => ({ chargerId, nonce: nonce.toNumber() }));
      })
    );

    const chargers = await Promise.all(
      chargersWithNonces.map(({ chargerId, nonce }) => {
        const attributeId = new Tuple(this.api!.registry, ['AccountId', 'Vec<u8>', 'u64'], [chargerId, 'location', nonce - 1]).hash;
        return this.api!.query.did
          .attributeOf(
            [
              chargerId,
              attributeId,
            ]
          )
          .then((attribute: any) => {
            return {
              chargerId,
              location: Buffer.from(attribute.toJSON().value.substring(2), 'hex').toString('utf-8'),
            };
          });
      })
    );

    return chargers.map(({ chargerId, location }) => {
      const decoded = JSON.parse(location);
      return {
        id: chargerId,
        lat: decoded[0],
        lng: decoded[1],
      };
    });
  }

  async hasPaymentConsent(address: string): Promise<boolean> {
    const api = await this.getApi();
    const consent = await api.query.sessionPayment.paymentConsents(address) as unknown as any;
    return consent.isSome;
  }

  async setPaymentConsent(iban: string, bic: string): Promise<void> {
    const api = await this.getApi();
    const tx = await api.tx.sessionPayment.newConsent(iban, bic, '') as SubmittableExtrinsic<"promise">;
    return this.signSendAndWait(tx, KeyringService.keypair);
  }

  async changeTariff(newTariff: number): Promise<void> {
    const api = await this.getApi();
    const tx = await api.tx.tariffManager.setCurrentPrice(newTariff) as SubmittableExtrinsic<"promise">;
    return this.signSendAndWait(tx, KeyringService.keypair);
  }

  async newChargeRequest(chargerId: string): Promise<void> {
    const api = await this.getApi();
    const tx = await api.tx.chargeSession.newRequest(chargerId) as SubmittableExtrinsic<"promise">;
    return this.signSendAndWait(tx, KeyringService.keypair);
  }

  async fundAccountIfRequired(address: string): Promise<void> {
    const api = await this.getApi();
    const res = await api.query.system.account(address);
    if(res.data.free.toNumber() >= 500000000000) return;
    const tx = await api.tx.balances.transfer(address, 1000000000000);
    return this.signSendAndWait(tx, KeyringService.fundingKeypair)
  }

  async getChargerStatusStream(
    chargerId: string,
    onChangeRequest: (request: ChargeRequest | null) => void,
    onChangeSession: (session: ChargeSession | null) => void,
  ): Promise<() => void> {
    const api = await this.getApi();
    const callbackSession = (session:any) => {
      const currentSession = (
        session.isNone
        ? null
        : {
          userId: session.value.get('user_id').toString(),
          sessionId: session.value.get('session_id').toString(),
          startedAt: new Date(session.value.get('started_at').toNumber()),
          chargerId,
        }
      );
      return onChangeSession(currentSession);
    };
    const callbackRequest = (request:any) => {
      const currentRequest = (
        request.isNone
        ? null
        : {
          userId: request.value.get('user_id').toString(),
          sessionId: request.value.get('session_id').toString(),
          createdAt: new Date(request.value.get('created_at').toNumber()),
          chargerId,
        }
      );
      return onChangeRequest(currentRequest);
    };
    return Promise
      .all([
        api.query.chargeSession.activeSessions(chargerId, callbackSession) as unknown as Promise<() => void>,
        api.query.chargeSession.userRequests(chargerId, callbackRequest) as unknown as Promise<() => void>,
      ])
      .then(([ unsubSession, unsubRequest ]) => {
        return () => {
          unsubSession();
          unsubRequest();
        }
      });
  }

  private signSendAndWait(tx: SubmittableExtrinsic<"promise">, keypair: KeyringPair): Promise<void> {
    return new Promise((resolve, reject) => {
      tx
        .signAndSend(keypair, (status: ISubmittableResult) => {
          if(status.isInBlock) return resolve();
        })
        .catch(reject);
    });
  }

};

export default new DelmonicosService();
