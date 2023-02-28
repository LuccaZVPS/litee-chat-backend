import { Express, urlencoded, json } from "express";
import fileUpload from "express-fileupload";
export default (app: Express) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp",
      limits: { fileSize: 2097152 },
      preservePath: true,
      preserveExtension: true,
    })
  );
};
