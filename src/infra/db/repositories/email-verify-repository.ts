import { CreateVerificationRepository } from "../../../data/protocols/account/create-verification-repository";
import { FindVerificationRepository } from "../../../data/protocols/account/find-verification-repository";
import { emailVerifyModel } from "../models/email-verify-model-db";

export class EmailVerifyRepository
  implements FindVerificationRepository, CreateVerificationRepository
{
  async find(_id: string): Promise<string | void> {
    const verificationFound = await emailVerifyModel.findOne({
      accountId: _id,
    });
    if (!verificationFound?._id) {
      return;
    }
    return verificationFound.secret;
  }
  async create(accountId: string, secret: string): Promise<void> {
    await emailVerifyModel.create({ accountId, secret });
    return;
  }
}
