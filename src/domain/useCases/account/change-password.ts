export interface ChangePassword {
  change(
    accountId: string,
    newPassword: string,
    requestId: string
  ): Promise<void>;
}
