import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import {
  AccountSession,
  CreateAccount as CreateAccountType,
} from "../../../domain/useCases/account/create-account";
import { CreateAccountRepository } from "../../protocols/account/create-account-repository";
import { Hasher } from "../../protocols/account/hasher";
import { GeneratePassword } from "../../protocols/account/generate-password";
import { CreateVerificationRepository } from "../../protocols/account/create-verification-repository";
import { SendVerificationEmail } from "../../protocols/account/send-verification-emai";

export class CreateAccount implements CreateAccountType {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly generatePassword: GeneratePassword,
    private readonly createVerificationRepository: CreateVerificationRepository,
    private readonly sendVerificationEmail: SendVerificationEmail
  ) {}
  async create(account: CreateAccountDTO): Promise<AccountSession> {
    const hashedPassword = this.hasher.hash(account.password);
    const accountData = await this.createAccountRepository.create({
      ...account,
      password: hashedPassword,
    });
    if (!accountData._id) {
      throw new Error();
    }
    const generatedPassword = this.generatePassword.generate();
    return accountData;
  }
}
