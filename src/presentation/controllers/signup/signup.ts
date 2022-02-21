import { badRequest, ok, serverError } from "../../helpers/http-helper";
import {
  IHttpResponse,
  IHttpRequest,
  IController,
  IAddAccount,
  IValidation,
} from "./signup-protocols";

export class SignUpController implements IController {
  private readonly addAccount: IAddAccount;
  private readonly validation: IValidation;

  constructor(addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

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
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
