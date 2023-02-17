import { AccountModel } from "@/domain/models/account";

export interface FindAccountByEmail {
  findByEmail(email: string): Promise<AccountModel>;
}
