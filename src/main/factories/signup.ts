import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountPrismaRepository } from "../../infra/db/prisma/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { IController } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): IController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const accountPrismaRepository = new AccountPrismaRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository);
  const signUpController = new SignUpController(emailValidator, dbAddAccount);
  return new LogControllerDecorator(signUpController);
};
