import { EmailVerify as EmailVerifyType } from "../../../domain/useCases/account/email-verify";
import { EmailVerifyRepository } from "../../protocols/account/email-verify-repository";
import { FindEmailStatusRepository } from "../../protocols/account/find-email-status-repository";

export class EmailVerify implements EmailVerifyType {
  constructor(
    private readonly findSecret: FindEmailStatusRepository,
    private readonly emailVerifyRepository: EmailVerifyRepository
  ) {}
  async verify(_id: string, password: string): Promise<boolean> {
    const emailStatus = await this.findSecret.find(_id);
    if (!emailStatus) {
      return false;
    }
    if (emailStatus.secret !== password) {
      return false;
    }
    await this.emailVerifyRepository.verify(_id);
    return true;
  }
}
