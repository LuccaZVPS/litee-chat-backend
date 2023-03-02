import { randomUUID } from "crypto";
import Mongoose from "mongoose";

export const emailStatusSchema = new Mongoose.Schema({
  _id: { type: String, default: randomUUID },
  accountId: { type: String, unique: true, required: true },
  secret: { type: String, required: true },
  verified: { type: String, required: false, default: false },
});
export const emailStatusModel = Mongoose.model(
  "emailStatus",
  emailStatusSchema
);
