import { FileTypeAdapter as FileTypeAdapterType } from "../../validation/protocols/file-type-adapter";
import { fromFile } from "file-type";
export class FileTypeAdapter implements FileTypeAdapterType {
  async getType(path: string): Promise<string> {
    return (await fromFile(path)).ext;
  }
}
