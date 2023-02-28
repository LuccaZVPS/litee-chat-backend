export interface FileType {
  checkFile(path: string): Promise<checkFileReturnType>;
}
export interface checkFileReturnType {
  isValid: boolean;
  extension: string;
}
