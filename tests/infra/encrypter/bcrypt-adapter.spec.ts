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
      jest.spyOn(bcryptjs, "hashSync").mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() => {
        sut.hash("any_hash");
      }).toThrow(new Error());
    });
    test("should return the same value as hashSync", () => {
      const { sut } = makeSut();
      jest.spyOn(bcryptjs, "hashSync").mockImplementationOnce(() => {
        return "any_hash";
      });
      const response = sut.hash("any_string");
      expect(response).toBe("any_hash");
    });
  });
  describe("CompareHash", () => {
    test("should call hash method with correct values", () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(bcryptjs, "compareSync");
      sut.compare("any_str", "any_hash");
      expect(spy).toHaveBeenCalledWith("any_str", "any_hash");
    });
    test("should throws if compareSync method throws", () => {
      const { sut } = makeSut();
      jest.spyOn(bcryptjs, "compareSync").mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() => {
        sut.compare("any_str", "any_hash");
      }).toThrow(new Error());
    });
    test("should return the same value as hashSync", () => {
      const { sut } = makeSut();
      jest.spyOn(bcryptjs, "compareSync").mockImplementationOnce(() => {
        return false;
      });
      const response = sut.compare("any_string", "any_hash");
      expect(response).toBe(false);
    });
  });
});
