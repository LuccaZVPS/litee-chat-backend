import { PasswordChangeRequest } from "../../../domain/models/password-change-request";
import { FindPasswordChangeRequest as FindPasswordChangeRequestType } from "../../../domain/useCases/account/find-password-change";
import { FindPasswordChangeRepository } from "../../protocols/account/find-password-change-repository";

export class FindPasswordChange implements FindPasswordChangeRequestType {
  constructor(
    private readonly findChangeRequest: FindPasswordChangeRepository
  ) {}
  async find(
    id: string,
    secret: string
  ): Promise<void | PasswordChangeRequest> {
    return await this.findChangeRequest.find(id, secret);
  }
}
