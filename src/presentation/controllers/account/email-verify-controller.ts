import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { VerifyEmailDTO } from "./DTOs/verify-email-dto";
export class EmailVerifyController implements Controller {
  constructor(private readonly validator: Validator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const verifyEmailDTO = new VerifyEmailDTO();
    for (const field in verifyEmailDTO) {
      if (httpRequest?.body[field]) {
        verifyEmailDTO[field] = httpRequest.body[field];
      }
    }
    const { errors } = await this.validator.validate(verifyEmailDTO);
    if (errors) {
      return badRequest(new InvalidBody(errors));
    }
    return { statusCode: 0, body: "" };
  }
}
