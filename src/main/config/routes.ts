import { Router } from "express";
import { Express } from "express";
import accountRoutes from "../routes/account-routes";
export default (app: Express) => {
  app.use("/api/account", accountRoutes);
};
