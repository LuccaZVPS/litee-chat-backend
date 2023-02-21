export interface FileType {
  type(path: string): Promise<string>;
}
