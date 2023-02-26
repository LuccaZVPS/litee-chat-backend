import express from "express";
import setUpRoutes from "./routes";
const app = express();
setUpRoutes(app);
export default app;
