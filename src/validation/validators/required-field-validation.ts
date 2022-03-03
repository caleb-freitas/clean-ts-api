import { MissingParamError } from "../../presentation/errors";
import { IValidation } from "../../presentation/protocols/validation";

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
