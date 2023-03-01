export interface EmailStatus {
  _id: string;
  secret: string;
  accountId: string;
  verified: boolean;
}
