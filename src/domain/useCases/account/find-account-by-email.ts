import { AccountModel } from "../../models/account";

export interface FindAccountByEmail {
  findByEmail(email: string): Promise<AccountModel>;
}
