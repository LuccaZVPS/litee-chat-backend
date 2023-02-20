import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyEmailDTO {
  constructor() {
    this._id = "";
    this.password = "";
  }
  @IsNotEmpty()
  @IsString()
  _id: string;
  @IsString()
  @Length(100, 100)
  password: string;
}
