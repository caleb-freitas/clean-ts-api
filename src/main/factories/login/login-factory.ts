import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwp-adapter/jwt-adapter";
import { AccountPrismaRepository } from "../../../infra/db/prisma/account/account-prisma-repository";
import { LogPrismaRepository } from "../../../infra/db/prisma/log/log-prisma-repository";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { IController } from "../../../presentation/protocols";
import env from "../../config/env";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): IController => {
  const salt = 12;
  const accountPrismaRepository = new AccountPrismaRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwt_secret_key);
  const dbAuthentication = new DbAuthentication(
    accountPrismaRepository,
    bcryptAdapter,
    jwtAdapter,
    accountPrismaRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );
  const logPrismaRepository = new LogPrismaRepository();
  return new LogControllerDecorator(loginController, logPrismaRepository);
};
