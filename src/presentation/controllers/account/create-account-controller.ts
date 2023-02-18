import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { CreateAccountDTO } from "./DTOs/create-account-dto";

export class CreateAccountController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findAccountByEmail: FindAccountByEmail //createAccout: CreateAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const createAccoutDTO = new CreateAccountDTO();
      for (const prop in createAccoutDTO) {
        if (httpRequest?.body[prop]) {
          createAccoutDTO[prop] = httpRequest.body[prop];
        }
      }
      const bodyErrors = (await this.validator.validate(createAccoutDTO))
        .errors;
      if (bodyErrors) {
        return badRequest(new InvalidBody(bodyErrors));
      }
      await this.findAccountByEmail.findByEmail(createAccoutDTO.email);
      return {} as unknown as HttpResponse;
    } catch {
      return serverError();
    }
  }
}
