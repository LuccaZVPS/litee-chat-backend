import {
  AccountSession,
  CreateAccount as CreateAccountType,
} from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { CreateAccountRepository } from "../../protocols/account/create-account-repository";
import { Hasher } from "../../protocols/account/hasher";
export class CreateAccount implements CreateAccountType {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository
  ) {}
  async create(account: CreateAccountDTO): Promise<AccountSession> {
    const hashedPassword = this.hasher.hash(account.password);
    const accountData = await this.createAccountRepository.create({
      ...account,
      password: hashedPassword,
    });
    if (!accountData._id) {
      throw new Error();
    }
    return;
  }
}
