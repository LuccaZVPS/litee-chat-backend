import { CreateAccountController } from "../../../src/presentation/controllers/account/create-account-controller";
import { Validator } from "../../../src/presentation/protocols/validator";
import { createDTO } from "./mocks/create-dto";

describe("Create Account Controller", () => {
  const createValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ Error: string }> {
        return { Error: "" };
      }
    }
    return new ValidatorStub();
  };
  const makeSut = () => {
    const validatorStub = createValidatorStub();
    return {
      validatorStub,
      sut: new CreateAccountController(validatorStub),
    };
  };
  test("should call validate method with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    const dto = createDTO;
    await sut.handle({ body: { ...dto } });
    expect(spy).toBeCalledWith(dto);
  });
});
