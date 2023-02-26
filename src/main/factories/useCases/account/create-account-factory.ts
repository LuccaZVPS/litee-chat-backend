import { BcryptAdapter } from "../../../../infra/encrypter/bcrypt-adapter";
import { SendEmail } from "../../../../infra/emails/verification";
import { CreateAccount } from "../../../../data/useCases/account/create-account";
import { GeneratePasswordAdapter } from "../../../../infra/utils/generate-password-adapter";
import { makeAccountRepository } from "../../repositories/account-repository";
import { makeVerifyRepository } from "../../repositories/verify-repository";
export const makeCreateAccount = () => {
  const hasher = new BcryptAdapter();
  const accountRepository = makeAccountRepository();
  const generatePassword = new GeneratePasswordAdapter();
  const emailVerifyRepository = makeVerifyRepository();
  const sendVerificationEmail = new SendEmail();
  return new CreateAccount(
    hasher,
    accountRepository,
    generatePassword,
    emailVerifyRepository,
    sendVerificationEmail
  );
};
