import generator from "generate-password";
import { GeneratePassword } from "../../data/protocols/account/generate-password";

export class GeneratePasswordAdapter implements GeneratePassword {
  generate(): string {
    return generator.generate({
      lowercase: true,
      uppercase: true,
      numbers: true,
      exclude: "/.*&$#@!()",
      length: 100,
    });
  }
}
