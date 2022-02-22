/* eslint-disable prettier/prettier */
import { ILoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { IAccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  test("should call LoadAccountByEmailRepository with correct email", async () => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadAccountByEmailRepository {
      async load(email: string): Promise<IAccountModel> {
        const account: IAccountModel = {
          id: "any_id",
          name: "any_name",
          email: "any@email.com",
          password: "any_password",
        };
        return new Promise((resolve) => resolve(account));
      }
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth({
      email: "any@mail.com",
      password: "any_password",
    });
    expect(loadSpy).toHaveBeenCalledWith("any@mail.com");
  });
});
