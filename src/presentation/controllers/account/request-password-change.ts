import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
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
    findAccountByEmail: FindAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requestPasswordChange = new RequestPasswordChangeDTO();
    for (const prop in requestPasswordChange) {
      if (httpRequest?.body[prop]) {
        requestPasswordChange[prop] = httpRequest.body[prop];
      }
    }
    const bodyErrors = await this.validator.validate(requestPasswordChange);
    return;
  }
}
