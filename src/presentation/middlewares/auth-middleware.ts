import { UnauthorizedError } from "../errors/unauthorized-error";
import { unauthorized } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/controller";
import { middleware } from "../protocols/middleware";

export class AuthMiddleware implements middleware {
  async run(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.session?.account) {
      return unauthorized(new UnauthorizedError());
    }
    return;
  }
}
