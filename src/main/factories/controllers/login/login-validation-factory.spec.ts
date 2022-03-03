import { IValidation } from "../../../../presentation/protocols/validation";
import { IEmailValidator } from "../../../../validation/protocols/email-validator";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";
import { makeLoginValidation } from "./login-validation-factory";

// remove the module's default behavior
jest.mock("../../../../validation/validators/validation-composite");

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("Login Validation Factory", () => {
  test("should call validation composite with all validation", () => {
    makeLoginValidation();
    const validations: IValidation[] = [];
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
