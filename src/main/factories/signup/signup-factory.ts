import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountPrismaRepository } from "../../../infra/db/prisma/account/account-prisma-repository";
import { LogPrismaRepository } from "../../../infra/db/prisma/log/log-prisma-repository";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { IController } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): IController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountPrismaRepository = new AccountPrismaRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository);
  const logPrismaRepository = new LogPrismaRepository();
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );
  return new LogControllerDecorator(signUpController, logPrismaRepository);
};
