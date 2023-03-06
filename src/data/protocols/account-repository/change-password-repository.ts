export interface changePasswordRepository {
  change(accountId: string, hash: string): Promise<void>;
}
