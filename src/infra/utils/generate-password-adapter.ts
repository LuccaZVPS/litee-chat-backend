import generator from "generate-password";
import { GeneratePassword } from "../../data/protocols/account/generate-password";

export class GeneratePasswordAdapter implements GeneratePassword {
  generate(): string {
    generator.generate({
      lowercase: true,
      uppercase: true,
      numbers: true,
      exclude: "/.*&$#@!()",
      length: 100,
    });
    return;
  }
}
