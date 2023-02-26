import { EmailVerifyRepository } from "../../../../infra/db/repositories/email-verify-repository";
import { EmailVerify } from "../../../../data/useCases/account/email-verify";
export const makeEmailVerify = () => {
  const emailVerifyRepository = new EmailVerifyRepository();
  return new EmailVerify(emailVerifyRepository, emailVerifyRepository);
};
