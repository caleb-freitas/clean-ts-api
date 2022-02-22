import { IAuthenticationModel } from "../../../domain/usecases/authentication";
import { IHashCompare } from "../../protocols/cryptography/hash-compare";
import { ITokenGenerator } from "../../protocols/cryptography/token-generator";
import { ILoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { IAccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): IAccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any@email.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    // eslint-disable-next-line prettier/prettier
    implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashCompareStub();
};

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve("token"));
    }
  }
  return new TokenGeneratorStub();
};

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: "any@mail.com",
  password: "any_password",
});

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  tokenGeneratorStub: ITokenGenerator;
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any@mail.com");
  });

  test("should throw LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should call HashCompare with correct values", async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("should throw HashCompare throws", async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if HashCompare returns", async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const compareSpy = jest.spyOn(tokenGeneratorStub, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_id");
  });
});
