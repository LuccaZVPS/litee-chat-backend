import { IsEmail } from "class-validator";

export class CreateRequestDTO {
  constructor() {
    this.email = "";
  }
  @IsEmail()
  email: string;
}
