import { CreateAccountDTO } from "../../src/presentation/controllers/account/DTOs/create-account-dto";
import {
  ClassValidator,
  ValidationError,
} from "../../src/validation/protocols/class-validator";
import { Validator } from "../../src/validation/validator";

describe("Validator", () => {
  const makeClassValidatorAdapterStub = () => {
    class ClassValidatorAdapterStub implements ClassValidator {
      async validate(): Promise<ValidationError[]> {
        return;
      }
    }
    return new ClassValidatorAdapterStub();
  };
  const makeSut = () => {
    const classValidatorAdapterStub = makeClassValidatorAdapterStub();
    return {
      classValidatorAdapterStub,
      sut: new Validator(classValidatorAdapterStub),
    };
  };
  test("should call validate with correct value", async () => {
    const { sut, classValidatorAdapterStub } = makeSut();
    const spy = jest.spyOn(classValidatorAdapterStub, "validate");
    const dtoExample = new CreateAccountDTO();
    await sut.validate(dtoExample);
    expect(spy).toHaveBeenCalledWith(dtoExample);
  });
  test("should throws if validate method throws", async () => {
    const { sut, classValidatorAdapterStub } = makeSut();
    jest
      .spyOn(classValidatorAdapterStub, "validate")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const dtoExample = new CreateAccountDTO();
    const response = sut.validate(dtoExample);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return empty error if validate return empty array", async () => {
    const { sut, classValidatorAdapterStub } = makeSut();
    jest
      .spyOn(classValidatorAdapterStub, "validate")
      .mockImplementationOnce(async () => []);
    const dtoExample = new CreateAccountDTO();
    const response = await sut.validate(dtoExample);
    expect(response).toEqual({ errors: "" });
  });
  test("should return errors in the correct format", async () => {
    const { sut, classValidatorAdapterStub } = makeSut();
    const value = [
      { property: "any_field", constraints: { any_error: "any_message" } },
    ];
    jest
      .spyOn(classValidatorAdapterStub, "validate")
      .mockImplementationOnce(async () => value);
    const returnValue = value.map((i) => {
      const messages = [];
      for (const prop in i.constraints) {
        messages.push(i.constraints[prop]);
      }
      return {
        field: i.property,
        errors: messages,
      };
    });
    const dtoExample = new CreateAccountDTO();
    const response = await sut.validate(dtoExample);
    expect(response).toEqual({ errors: returnValue.toString() });
  });
});
