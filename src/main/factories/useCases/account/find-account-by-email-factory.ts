import { FindAccountByEmail } from "../../../../data/useCases/account/find-account-by-email";
import { AccountRepository } from "../../../../infra/db/repositories/account-repository";

export const makeFindAccountByEmail = () => {
  const accountRepository = new AccountRepository();
  return new FindAccountByEmail(accountRepository);
};
