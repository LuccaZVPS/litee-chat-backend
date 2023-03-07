export interface SendVerificationEmail {
  sendVerification(
    name: string,
    email: string,
    _id: string,
    password: string
  ): Promise<void>;
}
