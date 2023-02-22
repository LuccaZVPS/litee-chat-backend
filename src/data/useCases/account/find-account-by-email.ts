import { AccountModel } from "../../../domain/models/account";
import { FindAccountByEmail as FindAccountByEmailType } from "../../../domain/useCases/account/find-account-by-email";
import { FindAccountByEmailRepository } from "../../protocols/account/find-account-by-email-repository";

export class FindAccountByEmail implements FindAccountByEmailType {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}
  async findByEmail(email: string): Promise<void | AccountModel> {
    const accountFound = await this.findAccountByEmailRepository.find(email);
    if (!accountFound || !accountFound._id) {
      return;
    }
    return;
  }
}
