import { CreateChangeRequestRepository } from "../../../data/protocols/passwordChangeRequest-repository/create-change-request-repository";
import { changePasswordRequestModel } from "../models/change-password-request";

export class ChangePasswordRequestRepository
  implements CreateChangeRequestRepository
{
  async create(accountId: string, secret: string): Promise<void> {
    await changePasswordRequestModel.create({ accountId, secret });
  }
}
