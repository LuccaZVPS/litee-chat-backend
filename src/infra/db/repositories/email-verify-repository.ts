import { FindVerificationRepository } from "../../../data/protocols/account/find-verification-repository";

export class EmailVerifyRepository implements FindVerificationRepository {
  find(_id: string): Promise<string | void> {
    return;
  }
}
