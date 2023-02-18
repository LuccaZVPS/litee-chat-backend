import { ServerError } from "../errors/server-error";

export const ok = (data: any) => {
  return {
    body: data,
    statusCode: 200,
  };
};
export const badRequest = (data: any) => {
  return {
    body: data,
    statusCode: 400,
  };
};

export const created = (data: any) => {
  return {
    body: data,
    statusCode: 204,
  };
};
export const unauthorized = (data: any) => {
  return {
    body: data,
    statusCode: 401,
  };
};
export const forbidden = (data: any) => {
  return {
    body: data,
    statusCode: 403,
  };
};
export const conflict = (data: any) => {
  return {
    body: data,
    statusCode: 409,
  };
};
export const serverError = () => ({
  statusCode: 500,
  body: new ServerError(),
});
