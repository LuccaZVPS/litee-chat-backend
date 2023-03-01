import { NextFunction, Request, Response } from "express";
import { middleware } from "../../presentation/protocols/middleware";

export const adaptMiddeware = (middleware: middleware) => {
  return async (req: Request, res: Response, Next: NextFunction) => {
    const request = {
      session: req?.session,
      headers: req?.headers,
    };
    const response = await middleware.run(request);
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      Next();
    } else {
      let message: any;
      try {
        message = JSON.parse(response.body.message);
      } catch {
        message = response.body;
      }
      return res.status(response.statusCode).json({
        error: message,
        statusCode: response.statusCode,
      });
    }
  };
};
