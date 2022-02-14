import { DbAddAccount } from "./db-add-account";
import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from "./db-add-account-protocols";

interface ISutTypes {
  sut: IAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid@mail.com",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if Encryper throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid@mail.com",
      password: "hashed_password",
    });
  });

  test("should throw if Encryper throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
});
