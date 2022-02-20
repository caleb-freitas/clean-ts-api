import { IAuthentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { IController, IHttpRequest, IHttpResponse } from "../../protocols";
import { IEmailValidator } from "../signup/signup-protocols";

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator;
  private readonly authentication: IAuthentication;

  constructor(
    emailValidator: IEmailValidator,
    authentication: IAuthentication
  ) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, password } = httpRequest.body;
    try {
      const requiredParams = ["email", "password"];
      // eslint-disable-next-line no-restricted-syntax
      for (const field of requiredParams) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const emailIsValid = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamError("email"));
      }
      await this.authentication.auth(email, password);
      return new Promise((resolve) =>
        resolve({
          body: {},
          statusCode: 0,
        })
      );
    } catch (error) {
      return serverError(error);
    }
  }
}
