import { EmailInUseError } from "../../errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../helpers/http/http-helper";
import {
  IHttpResponse,
  IHttpRequest,
  IController,
  IAddAccount,
  IValidation,
  IAuthentication,
} from "./signup-protocols";

export class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { name, email, password } = httpRequest.body;
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
