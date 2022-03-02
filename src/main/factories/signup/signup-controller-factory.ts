import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwp-adapter/jwt-adapter";
import { AccountPrismaRepository } from "../../../infra/db/prisma/account/account-prisma-repository";
import { LogPrismaRepository } from "../../../infra/db/prisma/log/log-prisma-repository";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { IController } from "../../../presentation/protocols";
import env from "../../config/env";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): IController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountPrismaRepository = new AccountPrismaRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository);
  const logPrismaRepository = new LogPrismaRepository();
  const jwtAdapter = new JwtAdapter(env.jwt_secret_key);
  const dbAuthentication = new DbAuthentication(
    accountPrismaRepository,
    bcryptAdapter,
    jwtAdapter,
    accountPrismaRepository
  );
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
    dbAuthentication
  );
  return new LogControllerDecorator(signUpController, logPrismaRepository);
};
