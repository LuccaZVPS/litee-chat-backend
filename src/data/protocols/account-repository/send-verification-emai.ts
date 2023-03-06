export interface SendVerificationEmail {
  send(
    name: string,
    email: string,
    _id: string,
    password: string
  ): Promise<void>;
}
