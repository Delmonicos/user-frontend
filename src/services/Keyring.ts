import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate, cryptoWaitReady } from '@polkadot/util-crypto';

class KeyringService {

  private keyring: Keyring | null = null;
  public keypair: KeyringPair | null = null;
  public address: string | null = null;

  async init() {
    await cryptoWaitReady();
    this.keyring = new Keyring({ type: 'sr25519' });
    const mnemonic = mnemonicGenerate();
    this.keypair = this.keyring.addFromMnemonic(mnemonic);
    this.address = this.keypair.address;
    console.log(`User address: ${this.address}`);
  } 

}

export default new KeyringService();
