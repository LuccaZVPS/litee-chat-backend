import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";

export interface CreateAccountRepository {
  create(createAccountDTO: CreateAccountDTO): Promise<AccountSession>;
}
