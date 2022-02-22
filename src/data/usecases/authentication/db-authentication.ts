import {
  IAuthentication,
  IAuthenticationModel,
} from "../../../domain/usecases/authentication";
import { IHashCompare } from "../../protocols/cryptography/hash-compare";
import { ITokenGenerator } from "../../protocols/cryptography/token-generator";
import { ILoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashCompare: IHashCompare;
  private readonly tokenGenerator: ITokenGenerator;

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashCompare,
    tokenGenerator: ITokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
      await this.tokenGenerator.generate(account.id);
    }
    return null;
  }
}
