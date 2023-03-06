import { EmailStatusModel } from "../../../domain/models/email-status";

export interface FindEmailStatusRepository {
  find(_id: string): Promise<EmailStatusModel | void>;
}
