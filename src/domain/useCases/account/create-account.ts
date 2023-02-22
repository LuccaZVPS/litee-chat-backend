import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import { Friend } from "../../models/friend";
import { Request } from "../../models/request";
export interface CreateAccount {
  create(account: CreateAccountDTO): Promise<AccountSession>;
}
export interface AccountSession {
  _id: string;
  name: string;
  email: string;
  friends: Friend[];
  requests: Request[];
  imageURL: string;
}
