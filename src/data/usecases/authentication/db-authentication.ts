import {
  IAuthentication,
  IAuthenticationModel,
  IHashCompare,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashCompare: IHashCompare;
  private readonly encrypter: IEncrypter;
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashCompare,
    encrypter: IEncrypter,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.encrypter = encrypter;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        account.password
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
