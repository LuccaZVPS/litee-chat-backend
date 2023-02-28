import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import { Controller, HttpResponse } from "../../protocols/controller";
import { FileType } from "../../protocols/file-type";
import { UpdateImage } from "../../../domain/useCases/account/update-image";
import crypto from "crypto";
export class UpdateImageController implements Controller {
  constructor(
    private readonly fileType: FileType,
    private readonly updateImage: UpdateImage
  ) {}
  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const isValid = await this.fileType.checkFile(
        httpRequest.file.tempFilePath
      );
      if (!isValid.isValid) {
        return badRequest(new InvalidBody("file extension not allowed"));
      }
      const path =
        process.cwd() + "/" + crypto.randomUUID() + "." + isValid.extension;
      await this.updateImage.update(httpRequest.userId, path);
      return ok("image updated");
    } catch {
      return serverError();
    }
  }
}
