export interface EmailStatusModel {
  _id: string;
  secret: string;
  accountId: string;
  verified: boolean;
}
