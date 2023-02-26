import { AccountRepository } from "../../../infra/db/repositories/account-repository";

export const makeAccountRepository = () => {
  return new AccountRepository();
};
