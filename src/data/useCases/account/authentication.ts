import { Authentication as AuthenticationType } from "../../../domain/useCases/account/authentication";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CompareHash } from "../../protocols/account/compare-hash";
import { FindAccountByEmailRepository } from "../../protocols/account/find-account-by-email-repository";

export class Authentication implements AuthenticationType {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly compareHash: CompareHash
  ) {}
  async auth(email: string, password: string): Promise<false | AccountSession> {
    const accountFound = await this.findAccountByEmailRepository.find(email);
    if (!accountFound) {
      return false;
    }
    const isEqual = this.compareHash.compare(password, accountFound.password);
    if (!isEqual) {
      return false;
    }
    return;
  }
}
