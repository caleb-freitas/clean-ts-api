import {
  IAuthentication,
  IAuthenticationModel,
} from "../../../domain/usecases/authentication";
import { IHashCompare } from "../../protocols/cryptography/hash-compare";
import { ITokenGenerator } from "../../protocols/cryptography/token-generator";
import { ILoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { IUpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashCompare: IHashCompare;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashCompare,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
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
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
