import { IsEmail } from "class-validator";

export class RequestPasswordChangeDTO {
  constructor() {
    this.email = "";
  }
  @IsEmail()
  email: string;
}
