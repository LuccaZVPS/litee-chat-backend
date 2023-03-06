import nodemailer from "nodemailer";
import { SendVerificationEmail } from "../../data/protocols/account-repository/send-verification-emai";
import { makeVerificationTemplate } from "./templates/verification-template";
// async..await is not allowed in global scope, must use a wrapper
export class SendEmail implements SendVerificationEmail {
  async send(
    name: string,
    email: string,
    _id: string,
    password: string
  ): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: `Litee Chat" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        html: makeVerificationTemplate(
          _id,
          password,
          name,
          process.env.FRONT_END_DOMAIN
        ), // html body
      });
    } catch (e) {
      console.log(e);
    }
  }
}
