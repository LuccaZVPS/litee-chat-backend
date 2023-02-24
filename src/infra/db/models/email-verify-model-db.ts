import { randomUUID } from "crypto";
import Mongoose from "mongoose";

export const emailVerifySchema = new Mongoose.Schema({
  _id: { type: String, default: randomUUID },
  accountId: { type: String, unique: true, required: true },
  secret: { type: String, required: true },
});
export const emailVerifyModel = Mongoose.model("accounts", emailVerifySchema);
