export interface SendChangePasswordEmail {
  send(accountId: string, secret: string): Promise<void>;
}
