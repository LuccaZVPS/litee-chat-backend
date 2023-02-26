import { AccountRepository } from "../../../../infra/db/repositories/account-repository";
import { EmailVerifyRepository } from "../../../../infra/db/repositories/email-verify-repository";
import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";
import { SendEmail } from "../../../../infra/emails/verification";
import { CreateAccount } from "../../../../data/useCases/account/create-account";
import { GeneratePasswordAdapter } from "../../../../infra/utils/generate-password-adapter";
export const makeCreateAccount = () => {
  const hasher = new BcryptAdapter();
  const accountRepository = new AccountRepository();
  const generatePassword = new GeneratePasswordAdapter();
  const emailVerifyRepository = new EmailVerifyRepository();
  const sendVerificationEmail = new SendEmail();
  return new CreateAccount(
    hasher,
    accountRepository,
    generatePassword,
    emailVerifyRepository,
    sendVerificationEmail
  );
};
