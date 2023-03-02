import { EmailVerify } from "../../../../data/useCases/account/email-verify";
import { makeAccountRepository } from "../../repositories/account-repository";
import { makeVerifyRepository } from "../../repositories/email-status";
export const makeEmailVerify = () => {
  return new EmailVerify(makeVerifyRepository(), makeAccountRepository());
};
