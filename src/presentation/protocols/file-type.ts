export interface FileType {
  checkFile(path: string): Promise<boolean>;
}
