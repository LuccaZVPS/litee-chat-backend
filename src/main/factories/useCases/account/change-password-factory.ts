import { ChangePassword } from "../../../../data/useCases/account/change-password";
import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";
import { makeAccountRepository } from "../../repositories/account-repository";
export const makeChangePassword = () => {
  const hasher = new BcryptAdapter();

  return new ChangePassword(hasher, makeAccountRepository());
};
