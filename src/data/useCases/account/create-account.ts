import { CreateAccountDTO } from "../../../presentation/controllers/account/DTOs/create-account-dto";
import {
  AccountSession,
  CreateAccount as CreateAccountType,
} from "../../../domain/useCases/account/create-account";
import { CreateAccountRepository } from "../../protocols/account-repository/create-account-repository";
import { Hasher } from "../../protocols/commom/hasher";
import { GeneratePassword } from "../../protocols/commom/generate-password";
import { CreateVerificationRepository } from "../../protocols/emailStatus-repository/create-verification-repository";
import { SendVerificationEmail } from "../../protocols/account-repository/send-verification-emai";

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
    await this.createVerificationRepository.create(
      accountData._id,
      generatedPassword
    );
    this.sendVerificationEmail.send(
      accountData.name,
      accountData.email,
      accountData._id,
      generatedPassword
    );
    return accountData;
  }
}
