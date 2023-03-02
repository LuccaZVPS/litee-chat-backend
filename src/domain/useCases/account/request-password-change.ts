export interface RequestPasswordChange {
  createRequest(accountId: string): Promise<void>;
}
