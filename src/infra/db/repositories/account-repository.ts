import { CreateAccountRepository } from "../../../data/protocols/account/create-account-repository";
import { FindAccountByEmailRepository } from "../../../data/protocols/account/find-account-by-email-repository";
import { EmailVerifyRepository } from "../../../data/protocols/account/email-verify-repository";
import { AccountModel } from "../../../domain/models/account";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { accountModel } from "../models/account-model-db";
export class AccountRepository
  implements
    CreateAccountRepository,
    FindAccountByEmailRepository,
    EmailVerifyRepository
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
  async verify(_id: string): Promise<void> {
    await accountModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          verified: true,
        },
      }
    );
    return;
  }
}
