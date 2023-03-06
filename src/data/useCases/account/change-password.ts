import { ChangePassword as ChangePasswordType } from "../../../domain/useCases/account/change-password";
import { changePasswordRepository } from "../../protocols/account-repository/change-password-repository";
import { Hasher } from "../../protocols/commom/hasher";
import { DeleteChangeRequestRepository } from "../../protocols/passwordChangeRequest-repository/delete-change-request-repository";

export class ChangePassword implements ChangePasswordType {
  constructor(
    private readonly hasher: Hasher,
    private readonly changePasswordRepository: changePasswordRepository,
    private readonly deleteChangePasswordRequest: DeleteChangeRequestRepository
  ) {}
  async change(
    accountId: string,
    newPassword: string,
    requestId: string
  ): Promise<void> {
    await this.hasher.hash(newPassword);
    return;
  }
}