import { UpdateImage } from "../../../../data/useCases/account/update-image";
import { makeAccountRepository } from "../../repositories/account-repository";

export const makeUpdateImageFactory = () => {
  const accountRepository = makeAccountRepository();
  return new UpdateImage(accountRepository);
};
