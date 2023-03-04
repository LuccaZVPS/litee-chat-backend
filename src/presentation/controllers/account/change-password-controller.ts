import { ChangePassword } from "../../../domain/useCases/account/change-password";
import { FindPasswordChangeRequest } from "../../../domain/useCases/account/find-password-change";
import { serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { ChangePasswordDTO } from "./DTOs/change-password-dto";

export class ChangePasswordController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findRequest: FindPasswordChangeRequest,
    private readonly changePassword: ChangePassword
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const verifyPasswordChangeDTO = new ChangePasswordDTO();
      for (const prop in verifyPasswordChangeDTO) {
        if (httpRequest?.body[prop]) {
          verifyPasswordChangeDTO[prop] = httpRequest.body[prop];
        }
      }
      const { errors } = await this.validator.validate(verifyPasswordChangeDTO);
      return;
    } catch {
      return serverError();
    }
  }
}
