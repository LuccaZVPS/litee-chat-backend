import { FileType } from "../presentation/protocols/file-type";
import { FileTypeAdapter } from "./protocols/file-type-adapter";

export class FileValidator implements FileType {
  constructor(private readonly fileTypeAdapter: FileTypeAdapter) {}
  async type(path: string): Promise<string> {
    await this.fileTypeAdapter.getType(path);
    return;
  }
}
