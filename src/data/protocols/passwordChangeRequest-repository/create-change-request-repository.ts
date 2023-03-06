export interface CreateChangeRequestRepository {
  create(accountId: string, secret: string): Promise<void>;
}
