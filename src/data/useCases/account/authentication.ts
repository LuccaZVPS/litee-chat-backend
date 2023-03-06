import { Authentication as AuthenticationType } from "../../../domain/useCases/account/authentication";
import { AccountSession } from "../../../domain/useCases/account/create-account";
import { CompareHash } from "../../protocols/commom/compare-hash";
import { FindAccountByEmailRepository } from "../../protocols/account-repository/find-account-by-email-repository";
import { FindEmailStatusRepository } from "../../protocols/emailStatus-repository/find-email-status-repository";

export class Authentication implements AuthenticationType {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly findEmailStatusRepository: FindEmailStatusRepository,
    private readonly compareHash: CompareHash
  ) {}
  async auth(email: string, password: string): Promise<false | AccountSession> {
    const accountFound = await this.findAccountByEmailRepository.find(email);
    if (!accountFound) {
      return false;
    }
    const emailStatus = await this.findEmailStatusRepository.find(
      accountFound._id
    );
    if (!emailStatus || !emailStatus._id) {
      return;
    }

    if (!emailStatus.verified) {
      return false;
    }
    const isEqual = this.compareHash.compare(password, accountFound.password);
    if (!isEqual) {
      return false;
    }
    return accountFound;
  }
}
