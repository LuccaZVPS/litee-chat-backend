export interface Validator {
  validate(data: any): Promise<{ errors: string }>;
}
