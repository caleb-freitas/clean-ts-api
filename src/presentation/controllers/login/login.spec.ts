import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { LoginController } from "./login";

interface ISutTypes {
  sut: LoginController;
}

const makeSut = (): any => {
  const sut = new LoginController();
  return {
    sut,
  };
};

describe("LoginController", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any@mail.com",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });
});
