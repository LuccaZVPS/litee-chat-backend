import { PasswordChangeRequest } from "../../../domain/models/password-change-request";

export interface FindPasswordChangeRepository {
  find(_id: string, secret: string): Promise<void | PasswordChangeRequest>;
}
