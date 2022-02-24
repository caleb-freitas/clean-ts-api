import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators";
import { IValidation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../adapters/validator/email-validator-adapter";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  const requiredFields = ["email", "password"];

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
