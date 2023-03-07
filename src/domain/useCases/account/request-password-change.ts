export interface RequestPasswordChange {
  createRequest(accountId: string, email: string): Promise<void>;
}
