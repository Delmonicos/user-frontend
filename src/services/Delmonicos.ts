import {
  ApiPromise,
  WsProvider,
} from '@polkadot/api';

import { Tuple } from '@polkadot/types';

import KeyringService from "../services/Keyring";
import Charger from "../models/Charger";
import config from "../config.json";

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
        }
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
    const tx = await api.tx.sessionPayment.newConsent(iban, bic, '') as unknown as any;
    return new Promise((resolve, reject) => {
      tx
        .signAndSend(KeyringService.keypair, (status: any) => {
          if(status.isInBlock) return resolve();
        })
        .catch(reject);
    });
  }

  async newChargeRequest(chargerId: string): Promise<void> {
    const api = await this.getApi();
    const tx = await api.tx.chargeSession.newRequest(chargerId) as unknown as any;
    return new Promise((resolve, reject) => {
      tx
        .signAndSend(KeyringService.keypair, (status: any) => {
          if(status.isInBlock) return resolve();
        })
        .catch(reject);
    });
  }

};

export default new DelmonicosService();
