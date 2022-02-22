import { CompareFieldsValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { IValidation } from "../../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { IEmailValidator } from "../../../presentation/protocols/email-validator";
import { makeLoginValidation } from "./login-validation";

// remove the module's default behavior
jest.mock("../../../presentation/helpers/validators/validation-composite");

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
