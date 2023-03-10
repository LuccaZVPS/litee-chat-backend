import { FindAccountByEmail } from "../../../domain/useCases/account/find-account-by-email";
import { CreateRequest } from "../../../domain/useCases/request/create-request";
import { InvalidBody } from "../../errors/invalid-body-error";
import {
  badRequest,
  conflict,
  notFound,
  ok,
  serverError,
} from "../../helpers/http-helper";
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
    private readonly findAccountByEmail: FindAccountByEmail,
    private readonly createRequest: CreateRequest
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const createAccoutDTO = new CreateRequestDTO();
      for (const prop in createAccoutDTO) {
        if (httpRequest?.body[prop]) {
          createAccoutDTO[prop] = httpRequest.body[prop];
        }
      }
      const { errors } = await this.validator.validate(createAccoutDTO);
      if (errors.length > 0) {
        return badRequest(new InvalidBody(errors));
      }
      const accountFound = await this.findAccountByEmail.findByEmail(
        createAccoutDTO.email
      );
      if (!accountFound || !accountFound?._id) {
        return notFound("account not found");
      }
      const created = await this.createRequest.create({
        from: httpRequest.account?._id,
        to: {
          _id: accountFound._id,
          requests: accountFound.requests,
          friendList: accountFound.friends,
        },
      });
      if (!created) {
        return conflict("request already sent");
      }
      return ok("request sent");
    } catch {
      return serverError();
    }
  }
}
