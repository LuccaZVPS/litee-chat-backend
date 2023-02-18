import { CreateAccountController } from "../../../src/presentation/controllers/account/create-account-controller";
import { Validator } from "../../../src/presentation/protocols/validator";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import { createDTO } from "./mocks/create-dto";
import { badRequest } from "../../../src/presentation/helpers/http-helper";

describe("Create Account Controller", () => {
  const createValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: string }> {
        return { errors: "" };
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
  test("should return badRequest with invalidBody error", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: "any_error" };
    });
    const dto = createDTO;
    const response = await sut.handle({ body: { ...dto } });
    expect(response).toEqual(badRequest(new InvalidBody("any_error")));
  });
});
