import { UnauthorizedError } from "../errors/unauthorized-error";
import { ok, unauthorized } from "../helpers/http-helper";
import { HttpResponse } from "../protocols/controller";
import { middleware, MiddlewareParams } from "../protocols/middleware";

export class AuthMiddleware implements middleware {
  async run(req: MiddlewareParams): Promise<HttpResponse> {
    if (!req.session.account || !req.session?.account?._id) {
      return unauthorized(new UnauthorizedError());
    }
    return ok("");
  }
}
