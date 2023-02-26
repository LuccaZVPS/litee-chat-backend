import { Authentication } from "../../../../data/useCases/account/authentication";
import { AccountRepository } from "../../../../infra/db/repositories/account-repository";
import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";

export const makeAuthentication = () => {
  const accountRepository = new AccountRepository();
  const hasher = new BcryptAdapter();
  return new Authentication(accountRepository, hasher);
};
