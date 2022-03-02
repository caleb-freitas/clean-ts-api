import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller";
import { IController } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../usecases/add-account/db-add-account-factory";
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): IController => {
  return makeLogControllerDecorator(
    new SignUpController(
      makeDbAddAccount(),
      makeSignUpValidation(),
      makeDbAuthentication()
    )
  );
};
