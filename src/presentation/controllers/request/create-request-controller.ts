import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols/controller";
import { Validator } from "../../protocols/validator";
import { CreateRequestDTO } from "./DTOs/create-request-DTO";

export class CreateRequestController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly findAccountByEmail: FindAccountByEmail
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const createAccoutDTO = new CreateRequestDTO();
    for (const prop in createAccoutDTO) {
      if (httpRequest?.body[prop]) {
        createAccoutDTO[prop] = httpRequest.body[prop];
      }
    }
    const { errors } = await this.validator.validate(createAccoutDTO);

    return;
  }
}
