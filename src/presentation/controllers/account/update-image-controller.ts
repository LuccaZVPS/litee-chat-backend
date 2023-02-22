import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpResponse } from "../../protocols/controller";
import { FileType } from "../../protocols/file-type";

export class UpdateImageController implements Controller {
  constructor(private readonly fileType: FileType) {}
  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const type = await this.fileType.type(httpRequest?.file?.path);
      const whiteList = ["img", "png", "jpg", "jpeg"];
      if (!whiteList.includes(type)) {
        return badRequest(new InvalidBody("file extension not allowed"));
      }
      return;
    } catch {
      return serverError();
    }
  }
}
