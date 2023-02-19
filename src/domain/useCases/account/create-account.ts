import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";

export interface CreateAccount {
  create(account: CreateAccountDTO): Promise<void>;
}
