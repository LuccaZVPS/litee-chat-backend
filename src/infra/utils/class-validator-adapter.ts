import {
  ClassValidator,
  ValidationError,
} from "../../validation/protocols/class-validator";
import { validate } from "class-validator";
export class ClassValidatorAdapter implements ClassValidator {
  async validate(dto: any): Promise<ValidationError[]> {
    return (await method.validate(dto)) as unknown as ValidationError[];
  }
}
export const method = {
  validate: async (dto: any) => validate(dto),
};
