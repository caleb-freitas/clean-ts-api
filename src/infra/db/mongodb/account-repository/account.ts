import { IAddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { IAccountModel } from "../../../../domain/models/account";
import { IAddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helper/mongodb-helper";

export class AccountMongoRepository implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const { insertedId: id } = result;
    const accountById = await accountCollection.findOne({ _id: id });
    const { _id, ...accountWithoutId } = accountById;
    const account = {
      ...accountWithoutId,
      id: _id.toHexString(),
    } as IAccountModel;

    return account;
  }
}
