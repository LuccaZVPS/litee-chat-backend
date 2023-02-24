import { Hasher } from "../../data/protocols/account/hasher";
import bcryptjs from "bcryptjs";
import { CompareHash } from "../../data/protocols/account/compare-hash";
export class BcryptAdapter implements Hasher, CompareHash {
  hash(str: string): string {
    return bcryptjs.hashSync(str);
  }
  compare(str: string, hash: string): boolean {
    bcryptjs.compareSync(str, hash);
    return;
  }
}
