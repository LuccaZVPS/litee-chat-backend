export interface PasswordChangeRequest {
  _id: string;
  secret: string;
  accountId: string;
  expiresIn: number;
  used: boolean;
}
