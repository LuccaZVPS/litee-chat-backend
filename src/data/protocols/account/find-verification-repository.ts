export interface FindVerificationRepository {
  find(_id: string): Promise<string | void>;
}
