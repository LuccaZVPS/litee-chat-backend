import {
  checkFileReturnType,
  FileType,
} from "../presentation/protocols/file-type";
import { FileTypeAdapter } from "./protocols/file-type-adapter";

export class FileValidator implements FileType {
  constructor(private readonly fileTypeAdapter: FileTypeAdapter) {}
  async checkFile(path: string): Promise<checkFileReturnType> {
    const fileExtension = await this.fileTypeAdapter.getType(path);
    if (!fileWhiteList.includes(fileExtension)) {
      return { extension: fileExtension, isValid: false };
    }
    return { extension: fileExtension, isValid: true };
  }
}
export const fileWhiteList = ["png", "jpg", "jpeg"];
