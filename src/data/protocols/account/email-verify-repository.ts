export interface EmailVerifyRepository {
  verify(_id: string): Promise<void>;
}
