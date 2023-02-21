import { serverError } from "../../helpers/http-helper";
import { Controller, HttpResponse } from "../../protocols/controller";
import { FileType } from "../../protocols/file-type";

export class UpdateImageController implements Controller {
  constructor(private readonly fileType: FileType) {}
  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      await this.fileType.type(httpRequest?.file?.path);
      return;
    } catch {
      return serverError();
    }
  }
}
