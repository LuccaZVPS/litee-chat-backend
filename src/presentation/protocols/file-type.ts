export interface FileType {
  type(): Promise<string>;
}
