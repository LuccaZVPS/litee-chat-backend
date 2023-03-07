import { RequestPasswordChange } from "../../../../data/useCases/account/request-password-change";
import { SendEmail } from "../../../../infra/emails/verification";
import { GeneratePasswordAdapter } from "../../../../infra/utils/generate-password-adapter";
import { makeChangePasswordRequestRepository } from "../../repositories/change-password-request-repository-factory";

export const makeRequestPasswordChange = () => {
  const generatePassword = new GeneratePasswordAdapter();
  const passwordChangeRequestRepository = makeChangePasswordRequestRepository();
  const sendEmail = new SendEmail();
  return new RequestPasswordChange(
    generatePassword,
    passwordChangeRequestRepository,
    sendEmail
  );
};
