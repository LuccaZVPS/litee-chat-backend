import { Response } from "express";
import { Controller } from "../../presentation/protocols/controller";

export const adptRoute = (controller: Controller) => {
  return async (req, res: Response) => {
    const request = {
      body: { ...req?.body, ...req?.params },
      account: req.account,
      file: req.files?.file,
    };
    const response = await controller.handle(request);
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return res.status(response.statusCode).json(response.body);
    } else {
      return res.status(response.statusCode).json({
        error: JSON.parse(response.body.message),
        statusCode: response.statusCode,
      });
    }
  };
};
