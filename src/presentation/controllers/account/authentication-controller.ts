import { UnauthorizedError } from "../../errors/unauthorized-error";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { AuthenticationDTO } from "./DTOs/authentication-dto";
import { Authentication } from "../../../domain/useCases/account/authentication";
import { InvalidBody } from "../../errors/invalid-body-error";

export class AuthenticationController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const authenticationDTO = new AuthenticationDTO();
      for (const field in authenticationDTO) {
        if (httpRequest?.body[field]) {
          authenticationDTO[field] = httpRequest.body[field];
        }
      }
      const { errors } = await this.validator.validate(authenticationDTO);
      if (errors.length > 0) {
        return badRequest(new InvalidBody(errors));
      }
      const isCorrect = await this.authentication.auth(
        authenticationDTO.email,
        authenticationDTO.password
      );
      if (!isCorrect) {
        return unauthorized(new UnauthorizedError());
      }
      return ok(isCorrect);
    } catch {
      return serverError();
    }
  }
}
