import { FindSecretRepository } from "../../../data/protocols/account/find-secrect-repository";

export class EmailVerifyRepository implements FindSecretRepository {
  find(_id: string): Promise<string | void> {
    return;
  }
}
