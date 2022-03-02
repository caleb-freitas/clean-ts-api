import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account";
import { DbAuthentication } from "../../../../data/usecases/authentication/db-authentication";
import { IAuthentication } from "../../../../domain/usecases/authentication";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/criptography/jwp-adapter/jwt-adapter";
import { AccountPrismaRepository } from "../../../../infra/db/prisma/account/account-prisma-repository";
import env from "../../../config/env";

export const makeDbAuthentication = (): IAuthentication => {
  const salt = 12;
  const accountPrismaRepository = new AccountPrismaRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwt_secret_key);
  return new DbAuthentication(
    accountPrismaRepository,
    bcryptAdapter,
    jwtAdapter,
    accountPrismaRepository
  );
};
