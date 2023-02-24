import { FindVerificationRepository } from "../../../data/protocols/account/find-verification-repository";
import { emailVerifyModel } from "../models/email-verify-model-db";

export class EmailVerifyRepository implements FindVerificationRepository {
  async find(_id: string): Promise<string | void> {
    await emailVerifyModel.findOne({ accountId: _id });
    return;
  }
}
