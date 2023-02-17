import { Message } from "./message";

export interface Friend {
  _id: string;
  imageURL: string;
  name: string;
  messages: Message[];
  accountId: string;
  email: string;
  createdAt: Date;
}
