import { HttpRequest, HttpResponse } from "./controller";

export interface middleware {
  run(middlewareParams: MiddlewareParams): Promise<HttpResponse>;
}
export interface MiddlewareParams {
  session: any;
  headers: any;
}
