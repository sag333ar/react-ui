import { AiohaCore, CustomProvider, LoginResult, Transaction, KeyTypes, Providers } from '@aioha/aioha';
import { PrivateKey } from '@hiveio/dhive';

class PrivateKeyProvider implements CustomProvider {
  public readonly aioha: AiohaCore;
  public readonly meta = {
    name: 'Private Key',
    icon: '',
  };
  private key?: PrivateKey;

  constructor(aioha: AiohaCore) {
    this.aioha = aioha;
  }

  async login(username: string, auth: KeyTypes, options: { key: string }): Promise<LoginResult> {
    try {
      this.key = PrivateKey.fromString(options.key);
      const pubKey = this.key.createPublic().toString();
      const accounts = await this.aioha.hive.getAccounts([username]);
      if (!accounts.length) {
        return { success: false, error: 'Account not found', provider: Providers.Custom, errorCode: 404 };
      }
      const account = accounts[0];

      // we are using posting key, so let's check the posting authority
      const auths = account.posting.key_auths;
      if (!auths.some(([key]) => key === pubKey)) {
        return { success: false, error: 'Incorrect private posting key', provider: Providers.Custom, errorCode: 401 };
      }
      return { success: true, provider: Providers.Custom, result: 'Logged in with private key', username, publicKey: pubKey };
    } catch (e: any) {
      return { success: false, error: e.message, provider: Providers.Custom, errorCode: 500 };
    }
  }

  async logout(): Promise<void> {
    this.key = undefined;
  }

  async signTx(tx: Transaction, authority: KeyTypes): Promise<Transaction> {
    if (authority !== KeyTypes.Posting) {
        throw new Error('Only posting authority is supported');
    }
    return this.aioha.hive.signTx(tx, this.key!);
  }

  async signMessage(message: string, authority: KeyTypes): Promise<string> {
    if (authority !== KeyTypes.Posting) {
        throw new Error('Only posting authority is supported');
    }
    return this.aioha.hive.signMessage(message, this.key!);
  }

  async getPublicKey(username: string, authority: KeyTypes, options: any): Promise<string> {
    if (authority !== KeyTypes.Posting) {
        throw new Error('Only posting authority is supported');
    }
    return this.key!.createPublic().toString();
  }
}

export default PrivateKeyProvider;
