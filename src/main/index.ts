import { mongoHelper } from "../infra/db/connection";
import app from "./config/app";
import { config } from "dotenv";
config();

mongoHelper
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`server running on ${process.env.SERVER_PORT}`);
    });
  })
  .catch((e) => console.log(e));
