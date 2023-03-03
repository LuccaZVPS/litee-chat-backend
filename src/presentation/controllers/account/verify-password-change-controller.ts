import { FindPasswordChangeRequest } from "../../../domain/useCases/account/find-password-change";
import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, notFound, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { VerifyPasswordChangeDTO } from "./DTOs/verifyPasswordChange-dto";

export class VerifyPasswordChangeController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findPasswordChange: FindPasswordChangeRequest
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const verifyPasswordChangeDTO = new VerifyPasswordChangeDTO();
      for (const prop in verifyPasswordChangeDTO) {
        if (httpRequest?.body[prop]) {
          verifyPasswordChangeDTO[prop] = httpRequest.body[prop];
        }
      }
      const { errors } = await this.validator.validate(verifyPasswordChangeDTO);
      if (errors.length > 0) {
        return badRequest(new InvalidBody(errors));
      }
      const requestChange = await this.findPasswordChange.find(
        verifyPasswordChangeDTO._id,
        verifyPasswordChangeDTO.secret
      );
      if (!requestChange || !requestChange._id) {
        return notFound("request not found");
      }
    } catch {
      return serverError();
    }
  }
}
