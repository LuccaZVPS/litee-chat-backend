import { Friend } from "./friend";
import { Request } from "./request";

export interface AccountModel {
  _id: string;
  name: string;
  email: string;
  password: string;
  friends: Friend[];
  requests: Request[];
  imageURL: string;
}
