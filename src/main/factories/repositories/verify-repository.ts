import { EmailVerifyRepository } from "../../../infra/db/repositories/email-verify-repository";

export const makeVerifyRepository = () => {
  return new EmailVerifyRepository();
};
