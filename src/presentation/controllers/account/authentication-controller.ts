import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { AuthenticationDTO } from "./DTOs/authentication-dto";

export class AuthenticationController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findAccountByEmail: FindAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const authenticationDTO = new AuthenticationDTO();
      for (const field in authenticationDTO) {
        if (httpRequest?.body[field]) {
          authenticationDTO[field] = httpRequest.body[field];
        }
      }
      await this.validator.validate(authenticationDTO);
      await this.findAccountByEmail.findByEmail(authenticationDTO.email);
      return { statusCode: 0, body: "" };
    } catch {
      return serverError();
    }
  }
}
