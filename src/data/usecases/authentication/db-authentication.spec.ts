/* eslint-disable prettier/prettier */
import { DbAuthentication } from "./db-authentication";
import {
  IAccountModel,
  IAuthenticationModel,
  IHashCompare,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from "./db-authentication-protocols";

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

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("token"));
    }
  }
  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub
    implements IUpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: "any@mail.com",
  password: "any_password",
});

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  encrypterStub: IEncrypter;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
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
    const encrypterSpy = jest.spyOn(hashCompareStub, "compare");
    await sut.auth(makeFakeAuthentication());
    expect(encrypterSpy).toHaveBeenCalledWith("any_password", "hashed_password");
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

  test("should return null if HashCompare returns false", async () => {
    const { sut, hashCompareStub } = makeSut();
    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call Encrypter with correct value", async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(encrypterSpy).toHaveBeenCalledWith("any_id");
  });

  test("should throw Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("token");
  });

  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "token");
  });

  test("should throw UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
