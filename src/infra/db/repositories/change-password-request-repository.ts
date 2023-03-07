import { CreateChangeRequestRepository } from "../../../data/protocols/passwordChangeRequest-repository/create-change-request-repository";
import { FindPasswordChangeRepository } from "../../../data/protocols/passwordChangeRequest-repository/find-password-change-repository";
import { UpdateUsedRequest } from "../../../data/protocols/passwordChangeRequest-repository/update-used-request-factory";
import { PasswordChangeRequest } from "../../../domain/models/password-change-request";
import { changePasswordRequestModel } from "../models/change-password-request";

export class ChangePasswordRequestRepository
  implements
    CreateChangeRequestRepository,
    FindPasswordChangeRepository,
    UpdateUsedRequest
{
  async create(accountId: string, secret: string): Promise<void> {
    await changePasswordRequestModel.create({ accountId, secret });
  }
  async find(
    _id: string,
    secret: string
  ): Promise<void | PasswordChangeRequest> {
    return await changePasswordRequestModel.findOne({
      accountId: _id,
      secret: secret,
    });
  }
  async updateToUsed(_id: string): Promise<void> {
    await changePasswordRequestModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          used: true,
        },
      }
    );
  }
}
