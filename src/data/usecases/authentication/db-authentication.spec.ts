/* eslint-disable prettier/prettier */
import { IAuthenticationModel } from "../../../domain/usecases/authentication";
import { ILoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { IAccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): IAccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any@email.com",
  password: "any_password",
})

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: "any@mail.com",
  password: "any_password",
})

interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any@mail.com");
  });
});
