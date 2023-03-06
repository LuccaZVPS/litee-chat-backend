import { ChangePassword as ChangePasswordType } from "../../../domain/useCases/account/change-password";
import { changePasswordRepository } from "../../protocols/account-repository/change-password-repository";
import { Hasher } from "../../protocols/commom/hasher";

export class ChangePassword implements ChangePasswordType {
  constructor(
    private readonly hasher: Hasher,
    private readonly changePasswordRepository: changePasswordRepository
  ) {}
  async change(accountId: string, newPassword: string): Promise<void> {
    const hash = this.hasher.hash(newPassword);
    await this.changePasswordRepository.change(accountId, hash);
    return;
  }
}
