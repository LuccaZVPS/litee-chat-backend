export interface Validator {
  validate(data: any): Promise<{ errors: errorType[] }>;
}
export interface errorType {
  field: string;
  errors: string[];
}
