import { HttpRequest, HttpResponse } from "./controller";

export interface middleware {
  run(body: HttpRequest): Promise<HttpResponse>;
}
