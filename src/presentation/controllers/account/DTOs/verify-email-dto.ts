import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyEmailDTO {
  constructor() {
    this._id = "";
    this.secret = "";
  }
  @IsNotEmpty()
  @IsString()
  _id: string;
  @IsString()
  @Length(100, 100)
  secret: string;
}
