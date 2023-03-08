export interface AccountModel {
  _id: string;
  name: string;
  email: string;
  password: string;
  friends: string[];
  requests: string[];
  imageURL: string;
}
