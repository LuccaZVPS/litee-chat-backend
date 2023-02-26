import { EmailVerify } from "../../../../data/useCases/account/email-verify";
import { makeAccountRepository } from "../../repositories/account-repository";
import { makeVerifyRepository } from "../../repositories/verify-repository";
export const makeEmailVerify = () => {
  return new EmailVerify(makeVerifyRepository(), makeAccountRepository());
};
