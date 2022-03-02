import { EmailInUseError, MissingParamError, ServerError } from "../../errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../helpers/http/http-helper";
import { SignUpController } from "./signup-controller";
import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IHttpRequest,
  IValidation,
  IAuthentication,
  IAuthenticationModel,
} from "./signup-protocols";

const makeFakeAccount = (): IAccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: "any_name",
    email: "any@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthenticationModel): Promise<string | null> {
      return new Promise((resolve) => resolve("token"));
    }
  }
  return new AuthenticationStub();
};

interface ISutTypes {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
  authenticationStub: IAuthentication;
}

const makeSut = (): ISutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return {
    sut,
    validationStub,
    addAccountStub,
    authenticationStub,
  };
};

describe("SignUp Controller", () => {
  test("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, rejects) => rejects(new Error()));
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError("email")));
  });

  test("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: "token" }));
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: "any@mail.com",
      password: "any_password",
    });
  });

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockReturnValueOnce(null as never);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
});
