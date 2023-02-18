import { InvalidBody } from "../../errors/invalid-body-error";
import { badRequest } from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { CreateAccountDTO } from "./DTOs/create-account-dto";

export class CreateAccountController implements Controller {
  constructor(
    private readonly validator: Validator //private readonly findByEmail: FindAccountByEmail, //createAccout: CreateAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const createAccoutDTO = new CreateAccountDTO();
    for (const prop in createAccoutDTO) {
      if (httpRequest?.body[prop]) {
        createAccoutDTO[prop] = httpRequest.body[prop];
      }
    }
    const bodyErrors = (await this.validator.validate(createAccoutDTO)).errors;
    if (bodyErrors) {
      return badRequest(new InvalidBody(bodyErrors));
    }

    return {} as unknown as HttpResponse;
  }
}
