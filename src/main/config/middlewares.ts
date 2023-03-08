import { Express, urlencoded, json, static as staticExpress } from "express";
import fileUpload from "express-fileupload";
import { makeRateLimit } from "./rate-limit";
export default (app: Express) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/uploads", staticExpress(process.cwd() + "/uploads"));
  app.use(
    "/api/account/image",
    fileUpload({
      useTempFiles: true,
      tempFileDir: process.cwd() + "/tmp",
      limits: { fileSize: 2097152 },
      preservePath: true,
      preserveExtension: true,
      abortOnLimit: true,
    })
  );
  app.use("/api/account/login", makeRateLimit(10, 60));
  app.use("/api/account/image", makeRateLimit(5, 60));
  app.use("/api/account/signup", makeRateLimit(10, 60));
  app.use("/api/account/change-password", makeRateLimit(5, 300));
};
