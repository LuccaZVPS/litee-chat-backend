import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { AuthenticationDTO } from "./DTOs/authentication-dto";

export class AuthenticationController implements Controller {
  constructor(private readonly validator: Validator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const authenticationDTO = new AuthenticationDTO();
    for (const field in authenticationDTO) {
      if (httpRequest?.body[field]) {
        authenticationDTO[field] = httpRequest.body[field];
      }
    }
    await this.validator.validate(authenticationDTO);
    return { statusCode: 0, body: "" };
  }
}
