import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { Controller, HttpResponse } from "../../protocols/controller";
import { FileType } from "../../protocols/file-type";
import { unlinkSync } from "fs";
import { UpdateImage } from "../../../domain/useCases/account/update-image";
export class UpdateImageController implements Controller {
  constructor(
    private readonly fileType: FileType,
    private readonly updateImage: UpdateImage
  ) {}
  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const isValid = await this.fileType.checkFile(httpRequest.file.path);
      if (!isValid) {
        unlinkFile.unlink(httpRequest.file.path);
        return badRequest(new InvalidBody("file extension not allowed"));
      }
      await this.updateImage.update(httpRequest.userId, httpRequest.file.path);
      return ok("image updated");
    } catch {
      return serverError();
    }
  }
}
export const unlinkFile = {
  unlink(path: string) {
    unlinkSync(path);
  },
};
