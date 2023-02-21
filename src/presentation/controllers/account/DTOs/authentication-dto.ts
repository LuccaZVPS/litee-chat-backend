import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthenticationDTO {
  constructor() {
    this.email = "";
    this.password = "";
  }
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
