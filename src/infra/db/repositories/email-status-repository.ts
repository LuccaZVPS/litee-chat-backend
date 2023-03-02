import { CreateVerificationRepository } from "../../../data/protocols/account/create-verification-repository";
import { FindEmailStatusRepository } from "../../../data/protocols/account/find-email-status-repository";
import { EmailStatusModel } from "../../../domain/models/email-status";
import { emailStatusModel } from "../models/email-staus-model-db";

export class EmailVerifyRepository
  implements FindEmailStatusRepository, CreateVerificationRepository
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
}
