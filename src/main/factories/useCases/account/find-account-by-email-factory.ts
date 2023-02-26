import { FindAccountByEmail } from "../../../../data/useCases/account/find-account-by-email";
import { makeAccountRepository } from "../../repositories/account-repository";

export const makeFindAccountByEmail = () => {
  const accountRepository = makeAccountRepository();
  return new FindAccountByEmail(accountRepository);
};
