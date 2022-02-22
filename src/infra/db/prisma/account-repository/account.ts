import { IAddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { IAccountModel } from "../../../../domain/models/account";
import { IAddAccountModel } from "../../../../domain/usecases/add-account";
import { prisma } from "../client/prisma-client";

export class AccountPrismaRepository implements IAddAccountRepository {
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
}
