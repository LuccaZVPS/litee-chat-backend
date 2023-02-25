import { FileType } from "../presentation/protocols/file-type";
import { FileTypeAdapter } from "./protocols/file-type-adapter";

export class FileValidator implements FileType {
  constructor(private readonly fileTypeAdapter: FileTypeAdapter) {}
  async checkFile(path: string): Promise<boolean> {
    await this.fileTypeAdapter.getType(path);
    return;
  }
}
