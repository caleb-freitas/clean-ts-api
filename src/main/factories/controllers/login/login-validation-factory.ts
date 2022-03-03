import { EmailValidatorAdapter } from "../../../../infra/validator/email-validator-adapter";
import { IValidation } from "../../../../presentation/protocols/validation";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../../validation/validators";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  const requiredFields = ["email", "password"];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
