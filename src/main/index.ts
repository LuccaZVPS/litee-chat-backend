import { mongoHelper } from "../infra/db/connection";
import app from "./config/app";
import { config } from "dotenv";
config();
const startup = async () => {
  await mongoHelper.connect(process.env.MONGODB_URL);
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`server running on ${process.env.SERVER_PORT}`);
  });
};
startup();
