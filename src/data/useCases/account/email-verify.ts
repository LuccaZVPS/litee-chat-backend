import { EmailVerify as EmailVerifyType } from "../../../domain/useCases/account/email-verify";
import { EmailVerifyRepository } from "../../protocols/account/email-verify-repository";
import { FindSecretRepository } from "../../protocols/account/find-secrect-repository";

export class EmailVerify implements EmailVerifyType {
  constructor(
    private readonly findSecret: FindSecretRepository,
    private readonly emailVerifyRepository: EmailVerifyRepository
  ) {}
  async verify(_id: string, password: string): Promise<boolean> {
    const secret = await this.findSecret.find(_id);
    if (!secret) {
      return false;
    }
    if (secret !== password) {
      return false;
    }
    await this.emailVerifyRepository.verify(_id);
    return true;
  }
}
