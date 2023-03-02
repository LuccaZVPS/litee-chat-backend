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
    findAccountByEmail: FindAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requestPasswordChange = new RequestPasswordChangeDTO();
      for (const prop in requestPasswordChange) {
        if (httpRequest?.body[prop]) {
          requestPasswordChange[prop] = httpRequest.body[prop];
        }
      }
      const isValid = await this.validator.validate(requestPasswordChange);
      if (isValid.errors) {
        return badRequest(new InvalidBody(isValid.errors));
      }
      return;
    } catch {
      return serverError();
    }
  }
}
