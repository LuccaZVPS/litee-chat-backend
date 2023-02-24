import { ValidationError } from "class-validator";
export interface ClassValidator {
  validate(dto: any): Promise<ValidationError[]>;
}
