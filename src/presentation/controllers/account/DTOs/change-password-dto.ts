import { IsString, IsUUID, Length, Matches } from "class-validator";

export class ChangePasswordDTO {
  constructor() {
    this._id = "";
    this.password = "";
    this.secret = "";
  }
  @IsString()
  @IsUUID()
  _id: string;
  @IsString()
  @Length(100, 100)
  secret: string;
  @Length(8, 30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,30}$/, {
    message:
      "Password should have at least one number and one uppercase letter",
  })
  password: string;
}
