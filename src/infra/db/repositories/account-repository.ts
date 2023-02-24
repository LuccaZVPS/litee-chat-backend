import { CreateAccountRepository } from "../../../data/protocols/account/create-account-repository";
import { FindAccountByEmailRepository } from "../../../data/protocols/account/find-account-by-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { accountModel } from "../models/account-model-db";
export class AccountRepository
  implements CreateAccountRepository, FindAccountByEmailRepository
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
}
