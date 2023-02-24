import { Hasher } from "../../data/protocols/account/hasher";
import bcryptjs from "bcryptjs";
export class BcryptAdapter implements Hasher {
  hash(str: string): string {
    return bcryptjs.hashSync(str);
  }
}
