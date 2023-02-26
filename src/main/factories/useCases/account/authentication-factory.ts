import { Authentication } from "../../../../data/useCases/account/authentication";
import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";
import { makeAccountRepository } from "../../repositories/account-repository";

export const makeAuthentication = () => {
  const accountRepository = makeAccountRepository();
  const hasher = new BcryptAdapter();
  return new Authentication(accountRepository, hasher);
};
