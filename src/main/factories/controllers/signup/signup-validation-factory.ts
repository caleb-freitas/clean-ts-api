import { EmailValidatorAdapter } from "../../../../infra/validator/email-validator-adapter";
import { IValidation } from "../../../../presentation/protocols/validation";
import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from "../../../../validation/validators";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  const requiredFields = ["name", "email", "password", "passwordConfirmation"];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(
    new CompareFieldsValidation("password", "passwordConfirmation")
  );

  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
