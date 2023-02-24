import { ValidationError } from "class-validator";
import {
  ClassValidatorAdapter,
  method,
} from "../../../src/infra/utils/class-validator-adapter";
import { CreateAccountDTO } from "../../../src/presentation/controllers/account/DTOs/create-account-dto";
describe("ClassValidatorAdapter", () => {
  const makeSut = () => {
    return {
      sut: new ClassValidatorAdapter(),
    };
  };
  test("should call validate with correct value", async () => {
    const { sut } = makeSut();
    const spy = jest.spyOn(method, "validate");
    const dto = new CreateAccountDTO();
    await sut.validate(dto);
    expect(spy).toHaveBeenCalledWith(dto);
  });
  test("should throws if validate method throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(method, "validate").mockImplementationOnce(async () => {
      throw new Error();
    });
    const dto = new CreateAccountDTO();
    const response = sut.validate(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return the same values as validate", async () => {
    const { sut } = makeSut();
    jest.spyOn(method, "validate").mockImplementationOnce(async () => {
      return "any" as unknown as ValidationError[];
    });
    const dto = new CreateAccountDTO();
    const response = await sut.validate(dto);
    expect(response).toBe("any");
  });
});
