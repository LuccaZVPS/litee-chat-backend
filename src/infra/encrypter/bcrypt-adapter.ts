import { Hasher } from "../../data/protocols/commom/hasher";
import bcryptjs from "bcryptjs";
import { CompareHash } from "../../data/protocols/commom/compare-hash";
export class BcryptAdapter implements Hasher, CompareHash {
  hash(str: string): string {
    return bcryptjs.hashSync(str);
  }
  compare(str: string, hash: string): boolean {
    return bcryptjs.compareSync(str, hash);
  }
}
