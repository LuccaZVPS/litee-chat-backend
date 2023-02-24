import nodemailer from "nodemailer";
import { SendVerificationEmail } from "../../../data/protocols/account/send-verification-emai";
// async..await is not allowed in global scope, must use a wrapper
export class SendEmail implements SendVerificationEmail {
  async send(
    name: string,
    email: string,
    _id: string,
    password: string
  ): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: ``, // html body
      });
    } catch (e) {
      console.log(e);
    }
  }
}
