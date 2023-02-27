import express from "express";
import setUpRoutes from "./routes";
import setUpMiddlewares from "./middlewares";
const app = express();
setUpMiddlewares(app);
setUpRoutes(app);
export default app;
