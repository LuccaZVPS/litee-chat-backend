export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
export interface HttpRequest {
  body?: any;
}
export interface HttpResponse {
  body?: any;
  statusCode: number;
}
