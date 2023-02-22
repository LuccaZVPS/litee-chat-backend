import { AccountSession } from "./create-account";

export interface Authentication {
  auth(email: string, password: string): Promise<false | AccountSession>;
}
