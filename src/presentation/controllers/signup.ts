import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredParams = ["name", "email"];
    // eslint-disable-next-line no-restricted-syntax
    for (const field of requiredParams) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
