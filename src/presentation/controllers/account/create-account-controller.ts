import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols/controller";
import { Validator } from "@/presentation/protocols/validator";
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
    await this.validator.validate(createAccoutDTO);

    return {} as unknown as HttpResponse;
  }
}
