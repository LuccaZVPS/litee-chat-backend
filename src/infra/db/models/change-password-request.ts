import Mongoose from "mongoose";
import { randomUUID } from "crypto";
const changePasswordRequestSchema = new Mongoose.Schema({
  _id: { type: String, default: randomUUID },
  secret: { type: String, required: true },
  accountId: { type: String, required: true },
  used: { type: Boolean, default: false },
  expiresIn: {
    type: Number,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});
export const changePasswordRequestModel = Mongoose.model(
  "changePasswordRequest",
  changePasswordRequestSchema
);
