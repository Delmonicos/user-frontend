import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate, cryptoWaitReady } from '@polkadot/util-crypto';

class KeyringService {

  private _fundingKeyring: Keyring | null = null;
  private _fundingKeypair: KeyringPair | null = null;

  private _keyring: Keyring | null = null;
  private _keypair: KeyringPair | null = null;
  private _address: string | null = null;

  async init() {
    await cryptoWaitReady();
    this._keyring = new Keyring({ type: 'sr25519' });
    let mnemonic = this.getMnemonicFromLocalStorage();
    if (mnemonic === null) {
      mnemonic = mnemonicGenerate();
      this.storeMnemonic(mnemonic);
    }
    this._keypair = this._keyring.addFromMnemonic(mnemonic);
    this._address = this._keypair.address;
    console.log(`User address: ${this.address}`);

    this._fundingKeyring = new Keyring({ type: 'sr25519' });
    this._fundingKeypair = this._fundingKeyring.createFromUri('//Alice');
    console.log(`Use funding address: ${this._fundingKeypair.address}`);
  }

  public get address() {
    return this._address!;
  }

  public get keypair() {
    return this._keypair!;
  }

  public get fundingKeypair() {
    return this._fundingKeypair!;
  }

  private getMnemonicFromLocalStorage() {
    return window.localStorage.getItem('mnemonic');
  }

  private storeMnemonic(value: string) {
    window.localStorage.setItem('mnemonic', value);
  }

}

export default new KeyringService();
