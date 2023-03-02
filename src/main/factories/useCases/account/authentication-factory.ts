import { Authentication } from "../../../../data/useCases/account/authentication";
import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";
import { makeAccountRepository } from "../../repositories/account-repository";
import { makeVerifyRepository } from "../../repositories/email-status";
export const makeAuthentication = () => {
  const accountRepository = makeAccountRepository();
  const hasher = new BcryptAdapter();
  return new Authentication(accountRepository, makeVerifyRepository(), hasher);
};
