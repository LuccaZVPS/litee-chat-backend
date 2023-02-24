import { Validator as ValidatorType } from "../presentation/protocols/validator";
import { ClassValidator } from "./protocols/class-validator";

export class Validator implements ValidatorType {
  constructor(private readonly classValidator: ClassValidator) {}
  async validate(data: any): Promise<{ errors: string }> {
    const validationErrors = await this.classValidator.validate(data);
    if (!validationErrors || validationErrors.length < 1) {
      return { errors: "" };
    }
    const errors = validationErrors.map((i) => {
      const messages = [];
      for (const prop in i.constraints) {
        messages.push(i.constraints[prop]);
      }
      return {
        field: i.property,
        errors: messages,
      };
    });
    return { errors: errors.toString() };
  }
}
