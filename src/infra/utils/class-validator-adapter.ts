import {
  ClassValidator,
  ValidationError,
} from "../../validation/protocols/class-validator";
import { validate } from "class-validator";
export class ClassValidatorAdapter implements ClassValidator {
  async validate(dto: any): Promise<ValidationError[]> {
    await method.validate(dto);
    return;
  }
}
export const method = {
  validate: async (dto: any) => validate(dto),
};
