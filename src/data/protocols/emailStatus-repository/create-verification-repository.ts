export interface CreateVerificationRepository {
  create(accountId: string, secret: string): Promise<void>;
}
