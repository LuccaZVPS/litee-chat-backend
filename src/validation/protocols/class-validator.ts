export interface ClassValidator {
  validate(dto: any): Promise<ValidationError[]>;
}
export interface ValidationError {
  property: string;
  constraints: any;
}
