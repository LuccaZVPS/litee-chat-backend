import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { RequestPasswordChangeDTO } from "./DTOs/request-password-change-dto";

export class RequestPasswordChangeController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findAccountByEmail: FindAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestPasswordChangeDTO = new RequestPasswordChangeDTO();
      for (const prop in requestPasswordChangeDTO) {
        if (httpRequest?.body[prop]) {
          requestPasswordChangeDTO[prop] = httpRequest.body[prop];
        }
      }
      const isValid = await this.validator.validate(requestPasswordChangeDTO);
      if (isValid.errors.length > 0) {
        return badRequest(new InvalidBody(isValid.errors));
      }
      await this.findAccountByEmail.findByEmail(requestPasswordChangeDTO.email);
      return;
    } catch {
      return serverError();
    }
  }
}
