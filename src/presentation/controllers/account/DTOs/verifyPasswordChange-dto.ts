import { IsString, IsUUID, Length } from "class-validator";

export class VerifyPasswordChangeDTO {
  constructor() {
    this._id = "";
    this.secret = "";
  }
  @IsString()
  @IsUUID()
  _id: string;
  @IsString()
  @Length(100, 100)
  secret: string;
}
