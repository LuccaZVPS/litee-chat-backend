import { PasswordChangeRequest } from "../../models/password-change-request";

export interface FindPasswordChangeRequest {
  find(id: string, secret: string): Promise<PasswordChangeRequest | void>;
}
