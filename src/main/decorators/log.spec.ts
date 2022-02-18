import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        body: {},
        statusCode: 200,
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  const controllerStub = new ControllerStub();
  return controllerStub;
};

const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe("LogControllerDecorator", () => {
  test("should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("should return the same result as the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      body: {},
      statusCode: 200,
    });
  });
});
