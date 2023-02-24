import generator from "generate-password";
import { GeneratePasswordAdapter } from "../../../src/infra/utils/generate-password-adapter";
describe("GeneratePasswordAdapter", () => {
  const makeSut = () => {
    return {
      sut: new GeneratePasswordAdapter(),
    };
  };
  test("should call generate with correct values", () => {
    const { sut } = makeSut();
    const spy = jest.spyOn(generator, "generate");
    sut.generate();
    expect(spy).toBeCalledWith({
      lowercase: true,
      uppercase: true,
      numbers: true,
      exclude: "/.*&$#@!()",
      length: 100,
      strict: false,
      symbols: false,
      excludeSimilarCharacters: false,
    });
  });
});
