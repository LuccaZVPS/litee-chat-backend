export interface CreateSecretRepository {
  create(accountId: string, secret: string): Promise<void>;
}
