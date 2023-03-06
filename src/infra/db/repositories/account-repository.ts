import { CreateAccountRepository } from "../../../data/protocols/account-repository/create-account-repository";
import { FindAccountByEmailRepository } from "../../../data/protocols/account-repository/find-account-by-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { accountModel } from "../models/account-model-db";
import { UpdateImageRepository } from "../../../data/protocols/account-repository/update-image-repository";
export class AccountRepository
  implements
    CreateAccountRepository,
    FindAccountByEmailRepository,
    UpdateImageRepository
{
  async create(createAccountDTO: CreateAccountDTO): Promise<AccountSession> {
    const account = await accountModel.create({ ...createAccountDTO });
    return {
      _id: account.id,
      email: account.email,
      friends: [],
      imageURL: account.imageURL,
      name: account.name,
      requests: [],
    };
  }
  async find(email: string): Promise<void | AccountModel> {
    const account = await accountModel.findOne({ email });
    if (!account?._id) {
      return;
    }
    return account as unknown as void;
  }
  async update(_id: string, path: string): Promise<void> {
    await accountModel.findOneAndUpdate({ _id }, { $set: { imageURL: path } });
    return;
  }
}
