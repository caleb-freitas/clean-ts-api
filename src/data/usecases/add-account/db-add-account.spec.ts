import { DbAddAccount } from "./db-add-account";
import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IHasher,
  ILoadAccountByEmailRepository,
} from "./db-add-account-protocols";

const makeFakeAccount = (): IAccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid@mail.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    // eslint-disable-next-line prettier/prettier
    implements ILoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeFakeAccountData = (): IAddAccountModel => ({
  name: "valid_name",
  email: "valid@mail.com",
  password: "valid_password",
});

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountRepositoryStub();
};

interface ISutTypes {
  sut: IAddAccount;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
}

const makeSut = (): ISutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");
    await sut.add(makeFakeAccountData());
    expect(hashSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeAccountData());
    expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid@mail.com",
      password: "hashed_password",
    });
  });

  test("should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeAccountData());
    expect(promise).rejects.toThrow();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });

  test("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.add(makeFakeAccountData());
    expect(loadSpy).toHaveBeenCalledWith("valid@mail.com");
  });
});
