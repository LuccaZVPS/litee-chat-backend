export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
interface HttpRequest {
  body?: any;
}
interface HttpResponse {
  body?: any;
  statusCode: number;
}
