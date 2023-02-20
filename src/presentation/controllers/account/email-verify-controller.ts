import { EmailVerify } from "../../../domain/useCases/account/email-verify";
import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { VerifyEmailDTO } from "./DTOs/verify-email-dto";
export class EmailVerifyController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly emailVerify: EmailVerify
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      await this.emailVerify.verify(
        verifyEmailDTO._id,
        verifyEmailDTO.password
      );
      return { statusCode: 0, body: "" };
    } catch {
      return serverError();
    }
  }
}