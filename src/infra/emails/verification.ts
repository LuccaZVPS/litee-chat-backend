import nodemailer from "nodemailer";
import { SendChangePasswordEmail } from "../../data/protocols/account-repository/send-change-password-email";
import { SendVerificationEmail } from "../../data/protocols/account-repository/send-verification-emai";
import { makeChangePasswordTemplate } from "./templates/change-password-template";
import { makeVerificationTemplate } from "./templates/verification-template";
export class SendEmail
  implements SendVerificationEmail, SendChangePasswordEmail
{
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendVerification(
    name: string,
    email: string,
    _id: string,
    password: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `Litee Chat" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        html: makeVerificationTemplate(
          _id,
          password,
          process.env.FRONT_END_DOMAIN
        ), // html body
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendChange(
    accountId: string,
    secret: string,
    email: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `Litee Chat" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        html: makeChangePasswordTemplate(
          accountId,
          secret,
          process.env.FRONT_END_DOMAIN
        ), // html body
      });
    } catch (e) {
      console.log(e);
    }
  }
}
