import { randomUUID } from "crypto";
import Mongoose from "mongoose";

export const accountSchema = new Mongoose.Schema({
  _id: { type: String, default: randomUUID },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  imageURL: { type: String },
  friends: [
    {
      type: Mongoose.Schema.Types.String,
      ref: "friends",
    },
  ],
  requests: [
    {
      type: Mongoose.Schema.Types.String,
      ref: "requests",
    },
  ],
});
export const accountModel = Mongoose.model("accounts", accountSchema);
