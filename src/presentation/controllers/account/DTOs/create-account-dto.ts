import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
export class CreateAccountDTO {
  constructor() {
    this.email = "";
    this.name = "";
    this.password = "";
  }
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  name: string;
  @IsString()
  @MaxLength(30)
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,30}$/, {
    message:
      "Password should have at least one number and one uppercase letter",
  })
  password: string;
}
