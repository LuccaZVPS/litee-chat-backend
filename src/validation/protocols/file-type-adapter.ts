export interface FileTypeAdapter {
  getType(path: string): Promise<string>;
}
