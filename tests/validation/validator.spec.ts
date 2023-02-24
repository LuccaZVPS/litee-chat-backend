import { ValidationError } from "class-validator";
import { CreateAccountDTO } from "../../src/presentation/controllers/account/DTOs/create-account-dto";
import { ClassValidator } from "../../src/validation/protocols/class-validator";
import { Validator } from "../../src/validation/validator";

describe("Validator", () => {
  const makeClassValidatorAdapterStub = () => {
    class ClassValidatorAdapterStub implements ClassValidator {
      async validate(dto: any): Promise<ValidationError[]> {
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
});
