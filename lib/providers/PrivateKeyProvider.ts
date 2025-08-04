import { AiohaCore, Authority, CustomProvider, LoginResult, Transaction } from '@aioha/aioha';
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

  async login(username: string, auth: Authority, options: { key: string }): Promise<LoginResult> {
    try {
      this.key = PrivateKey.fromString(options.key);
      const pubKey = this.key.createPublic().toString();
      const accounts = await this.aioha.hive.getAccounts([username]);
      if (!accounts.length) {
        return { success: false, error: 'Account not found' };
      }
      const account = accounts[0];

      // we are using posting key, so let's check the posting authority
      const auths = account.posting.key_auths;
      if (!auths.some(([key]) => key === pubKey)) {
        return { success: false, error: 'Incorrect private posting key' };
      }
      return { success: true, result: { username, pubKey, authorities: [Authority.POSTING] } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async logout(): Promise<void> {
    this.key = undefined;
  }

  async signTx(tx: Transaction, authority: Authority): Promise<Transaction> {
    if (authority !== Authority.POSTING) {
        throw new Error('Only posting authority is supported');
    }
    return this.aioha.hive.signTx(tx, this.key!);
  }

  async signMessage(message: string, authority: Authority): Promise<string> {
    if (authority !== Authority.POSTING) {
        throw new Error('Only posting authority is supported');
    }
    return this.aioha.hive.signMessage(message, this.key!);
  }

  async getPublicKey(username: string, authority: Authority, options: any): Promise<string> {
    if (authority !== Authority.POSTING) {
        throw new Error('Only posting authority is supported');
    }
    return this.key!.createPublic().toString();
  }
}

export default PrivateKeyProvider;
