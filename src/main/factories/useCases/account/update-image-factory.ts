import { UpdateImage } from "../../../../data/useCases/account/update-image";
import { AccountRepository } from "../../../../infra/db/repositories/account-repository";

export const makeUpdateImageFactory = () => {
  const accountRepository = new AccountRepository();
  return new UpdateImage(accountRepository);
};
