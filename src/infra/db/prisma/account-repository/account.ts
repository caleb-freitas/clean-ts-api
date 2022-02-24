import { IAddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { ILoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { IUpdateAccessTokenRepository } from "../../../../data/protocols/db/update-access-token-repository";
import { IAccountModel } from "../../../../domain/models/account";
import { IAddAccountModel } from "../../../../domain/usecases/add-account";
import { prisma } from "../client/prisma-client";

export class AccountPrismaRepository
  // eslint-disable-next-line prettier/prettier
  implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const { name, email, password } = accountData;
    const account = await prisma.accounts.create({
      data: {
        name,
        email,
        password,
      },
    });
    return account;
  }

  async loadByEmail(email: string): Promise<IAccountModel | null> {
    const account = await prisma.accounts.findFirst({
      where: {
        email,
      },
    });
    return account;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    await prisma.accounts.update({
      where: {
        id,
      },
      data: {
        access_token: token,
      },
    });
  }
}
