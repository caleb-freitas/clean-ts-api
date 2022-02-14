import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository;

  constructor(
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hasehdPassword = await this.encrypter.encrypt(accountData.password);
    await this.addAccountRepository.add({
      ...accountData,
      password: hasehdPassword,
    });
    return new Promise((resolve) => resolve(null));
  }
}
