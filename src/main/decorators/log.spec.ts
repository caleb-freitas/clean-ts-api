import { ILogErrorRepository } from "../../data/protocols/db/log-error-repository";
import { IAccountModel } from "../../domain/models/account";
import { ok, serverError } from "../../presentation/helpers/http/http-helper";
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}

const makeFakeAccount = (): IAccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }
  const controllerStub = new ControllerStub();
  return controllerStub;
};

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositorySub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositorySub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe("LogControllerDecorator", () => {
  test("should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test("should return the same result as the controller", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test("should call LogErrorRepository with correct error if controller returns 500", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
