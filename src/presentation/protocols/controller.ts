import { AccountSession } from "../../domain/useCases/account/create-account";

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
export interface HttpRequest {
  body?: any;
  account?: AccountSession;
}
export interface HttpResponse {
  body?: any;
  statusCode: number;
}
