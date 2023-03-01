import { Express, urlencoded, json, static as staticExpress } from "express";
import fileUpload from "express-fileupload";
export default (app: Express) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/uploads", staticExpress(process.cwd() + "/uploads"));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: process.cwd() + "/tmp",
      limits: { fileSize: 2097152 },
      preservePath: true,
      preserveExtension: true,
      abortOnLimit: true,
    })
  );
};
