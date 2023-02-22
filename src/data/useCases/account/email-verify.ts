import { EmailVerify as EmailVerifyType } from "../../../domain/useCases/account/email-verify";
import { EmailVerifyRepository } from "../../protocols/account/email-verify-repository";
import { FindSecret } from "../../protocols/account/find-secrect";

export class EmailVerify implements EmailVerifyType {
  constructor(
    private readonly findSecret: FindSecret,
    private readonly emailVerifyRepository: EmailVerifyRepository
  ) {}
  async verify(_id: string, password: string): Promise<boolean> {
    await this.findSecret.find(_id);
    return;
  }
}
