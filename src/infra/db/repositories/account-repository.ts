import { CreateAccountRepository } from "../../../data/protocols/account/create-account-repository";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { accountModel } from "../models/account-model-db";
export class AccountRepository implements CreateAccountRepository {
  async create(createAccountDTO: CreateAccountDTO): Promise<AccountSession> {
    await accountModel.create({ ...createAccountDTO });
    return;
  }
}
