import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { IController } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): IController => {
  return makeLogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation())
  );
};
