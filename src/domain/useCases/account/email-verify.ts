export interface EmailVerify {
  verify(_id: string, password: string): Promise<boolean>;
}
