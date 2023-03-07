import { ChangePassword as ChangePasswordType } from "../../../domain/useCases/account/change-password";
import { changePasswordRepository } from "../../protocols/account-repository/change-password-repository";
import { Hasher } from "../../protocols/commom/hasher";
import { UpdateUsedRequest } from "../../protocols/passwordChangeRequest-repository/update-used-request-factory";

export class ChangePassword implements ChangePasswordType {
  constructor(
    private readonly hasher: Hasher,
    private readonly changePasswordRepository: changePasswordRepository,
    private readonly updateChangeRequest: UpdateUsedRequest
  ) {}
  async change(
    accountId: string,
    newPassword: string,
    requestId: string
  ): Promise<void> {
    const hash = this.hasher.hash(newPassword);
    await this.changePasswordRepository.change(accountId, hash);
    await this.updateChangeRequest.updateToUsed(requestId);
    return;
  }
}
