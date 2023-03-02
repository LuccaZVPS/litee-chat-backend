import { CreateVerificationRepository } from "../../../data/protocols/account/create-verification-repository";
import { EmailVerifyRepository } from "../../../data/protocols/account/email-verify-repository";
import { FindEmailStatusRepository } from "../../../data/protocols/account/find-email-status-repository";
import { EmailStatusModel } from "../../../domain/models/email-status";
import { emailStatusModel } from "../models/email-staus-model-db";

export class EmailStatusRepository
  implements
    FindEmailStatusRepository,
    CreateVerificationRepository,
    EmailVerifyRepository
{
  async find(_id: string): Promise<EmailStatusModel | void> {
    const verificationFound = await emailStatusModel.findOne({
      accountId: _id,
    });
    if (!verificationFound?._id) {
      return;
    }
    return verificationFound as unknown as EmailStatusModel;
  }
  async create(accountId: string, secret: string): Promise<void> {
    await emailStatusModel.create({ accountId, secret });
    return;
  }
  async verify(_id: string): Promise<void> {
    return;
  }
}
