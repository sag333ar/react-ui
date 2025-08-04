import { AiohaProviderBase, LoginResult, Transaction, KeyTypes, Providers, OperationResult, OperationResultObj, SignOperationResult, SignOperationResultObj, PersistentLogin, LoginOptions } from '@aioha/aioha';
import { PrivateKey, Operation } from '@hiveio/dhive';
import { SimpleEventEmitter } from '@aioha/aioha/build/lib/event-emitter';

class PrivateKeyProvider extends AiohaProviderBase {
  private key?: PrivateKey;
  private username?: string;

  constructor(api: string, emitter?: SimpleEventEmitter) {
    super(api, emitter);
  }

  async login(username: string, options: LoginOptions & { key: string }): Promise<LoginResult> {
    try {
      this.key = PrivateKey.fromString(options.key);
      const pubKey = this.key.createPublic().toString();
      // This is a hack, Aioha should provide a way to get the hive client.
      const accounts = await new (await import('@hiveio/dhive')).Client(this.api).database.getAccounts([username]);
      if (!accounts.length) {
        return { success: false, error: 'Account not found', provider: Providers.Custom, errorCode: 404 };
      }
      const account = accounts[0];

      const auths = account.posting.key_auths;
      if (!auths.some(([key]) => key === pubKey)) {
        return { success: false, error: 'Incorrect private posting key', provider: Providers.Custom, errorCode: 401 };
      }
      this.username = username;
      return { success: true, provider: Providers.Custom, result: 'Logged in with private key', username, publicKey: pubKey };
    } catch (e: any) {
      return { success: false, error: e.message, provider: Providers.Custom, errorCode: 500 };
    }
  }

  async logout(): Promise<void> {
    this.key = undefined;
    this.username = undefined;
  }

  async signTx(tx: Transaction, keyType: KeyTypes): Promise<SignOperationResultObj> {
    if (keyType !== KeyTypes.Posting) {
        throw new Error('Only posting authority is supported');
    }
    // This is a hack, Aioha should provide a way to get the hive client.
    const client = new (await import('@hiveio/dhive')).Client(this.api);
    const props = await client.database.getDynamicGlobalProperties();
    const signedTx = await client.broadcast.sign(tx, this.key!);
    return { success: true, result: signedTx };
  }

  async signMessage(message: string, keyType: KeyTypes): Promise<OperationResult> {
    if (keyType !== KeyTypes.Posting) {
        throw new Error('Only posting authority is supported');
    }
    const signature = this.key!.sign(message).toString();
    return { success: true, result: signature };
  }

  // Implement other abstract methods with dummy implementations
  async loginAndDecryptMemo(username: string, options: LoginOptions): Promise<LoginResult> {
    throw new Error('Method not implemented.');
  }
  loadAuth(username: string): boolean {
    throw new Error('Method not implemented.');
  }
  getUser(): string | undefined {
    return this.username;
  }
  getLoginInfo(): PersistentLogin | undefined {
    return undefined;
  }
  loadLogin(username: string, info: PersistentLogin): boolean {
    throw new Error('Method not implemented.');
  }
  async encryptMemo(message: string, keyType: KeyTypes, recipient: string): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  async encryptMemoWithKeys(message: string, keyType: KeyTypes, recipientKeys: string[]): Promise<OperationResultObj> {
    throw new Error('Method not implemented.');
  }
  async decryptMemo(memo: string, keyType: KeyTypes): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  async signAndBroadcastTx(tx: Operation[], keyType: KeyTypes): Promise<SignOperationResult> {
    throw new Error('Method not implemented.');
  }
}

export default PrivateKeyProvider;
