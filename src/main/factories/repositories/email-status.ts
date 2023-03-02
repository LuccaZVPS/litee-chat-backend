import { EmailVerifyRepository } from "../../../infra/db/repositories/email-status-repository";

export const makeVerifyRepository = () => {
  return new EmailVerifyRepository();
};
