import { EmailVerify } from "../../../../data/useCases/account/email-verify";
import { makeVerifyRepository } from "../../repositories/email-status";
export const makeEmailVerify = () => {
  return new EmailVerify(makeVerifyRepository(), makeVerifyRepository());
};
