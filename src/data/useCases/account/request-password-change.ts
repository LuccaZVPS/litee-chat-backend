import { RequestPasswordChange as RequestPasswordChangeType } from "../../../domain/useCases/account/request-password-change";
import { CreateChangeRequestRepository } from "../../protocols/passwordChangeRequest-repository/create-change-request-repository";
import { GeneratePassword } from "../../protocols/commom/generate-password";
import { SendChangePasswordEmail } from "../../protocols/account-repository/send-change-password-email";

export class RequestPasswordChange implements RequestPasswordChangeType {
  constructor(
    private readonly generateSecret: GeneratePassword,
    private readonly createChangeRequest: CreateChangeRequestRepository,
    private readonly sendChangeEmail: SendChangePasswordEmail
  ) {}
  async createRequest(accountId: string, email: string): Promise<void> {
    const secret = this.generateSecret.generate();
    await this.createChangeRequest.create(accountId, secret);
    await this.sendChangeEmail.sendChange(accountId, secret, email);
    return;
  }
}
