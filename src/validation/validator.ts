import { Validator as ValidatorType } from "../presentation/protocols/validator";
import { ClassValidator } from "./protocols/class-validator";

export class Validator implements ValidatorType {
  constructor(private readonly classValidator: ClassValidator) {}
  async validate(data: any): Promise<{ errors: string }> {
    await this.classValidator.validate(data);
    return;
  }
}
