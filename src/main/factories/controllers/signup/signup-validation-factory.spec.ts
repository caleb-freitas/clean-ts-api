import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from "../../../../presentation/helpers/validators";
import { IEmailValidator } from "../../../../presentation/protocols/email-validator";
import { IValidation } from "../../../../presentation/protocols/validation";
import { makeSignUpValidation } from "./signup-validation-factory";

// remove the module's default behavior
jest.mock("../../../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe("SignUp Validation Factory", () => {
  test("should call validation composite with all validation", () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    validations.push(new EmailValidation("email", makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations);
  });
});
