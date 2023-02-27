import { Express, urlencoded, json } from "express";

export default (app: Express) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
};
