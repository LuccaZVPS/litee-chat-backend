import { CreateAccount } from "../../../domain/useCases/account/create-account";
import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { InvalidBody } from "../../errors/invalid-body-error";
import { UsedEmailError } from "../../errors/used-email-error";
import {
  badRequest,
  conflict,
  created,
  serverError,
} from "../../helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { SendEmail } from "../../protocols/send-email";
import { Validator } from "../../protocols/validator";
import { CreateAccountDTO } from "./DTOs/create-account-dto";

export class CreateAccountController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findAccountByEmail: FindAccountByEmail,
    private readonly createAccout: CreateAccount,
    private readonly sendEmail: SendEmail
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
      const emailAlreadyTaken = await this.findAccountByEmail.findByEmail(
        createAccoutDTO.email
      );
      if (emailAlreadyTaken) {
        return conflict(new UsedEmailError());
      }
      const { _id } = await this.createAccout.create(createAccoutDTO);
      this.sendEmail.send(createAccoutDTO.email, createAccoutDTO.name, _id);
      return created("");
    } catch {
      return serverError();
    }
  }
}
