import bcryptjs from "bcryptjs";
import { BcryptAdapter } from "../../../src/infra/encrypter/bcrypt-adapter";
describe("BcryptAdapter", () => {
  const makeSut = () => {
    return {
      sut: new BcryptAdapter(),
    };
  };
  describe("Hasher", () => {
    test("should call hash method with correct values", () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(bcryptjs, "hashSync");
      sut.hash("any_str");
      expect(spy).toHaveBeenCalledWith("any_str");
    });
    test("should throws if hash method throws", () => {
      const { sut } = makeSut();
      const spy = jest
        .spyOn(bcryptjs, "hashSync")
        .mockImplementationOnce(() => {
          throw new Error();
        });
      expect(() => {
        sut.hash("any_hash");
      }).toThrow(new Error());
    });
  });
});
