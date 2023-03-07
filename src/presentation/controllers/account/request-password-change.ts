import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { RequestPasswordChange } from "../../../domain/useCases/account/request-password-change";
import { InvalidBody } from "../../errors/invalid-body-error";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../helpers/http-helper";
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
    private readonly findAccountByEmail: FindAccountByEmail,
    private readonly RequestChange: RequestPasswordChange
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
      const account = await this.findAccountByEmail.findByEmail(
        requestPasswordChangeDTO.email
      );
      if (!account || !account._id) {
        return notFound("email cant be found");
      }
      await this.RequestChange.createRequest(account._id, account.email);
      return ok("sucess");
    } catch {
      return serverError();
    }
  }
}
