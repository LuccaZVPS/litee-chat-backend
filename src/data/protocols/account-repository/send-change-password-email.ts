export interface SendChangePasswordEmail {
  sendChange(accountId: string, secret: string, email: string): Promise<void>;
}
