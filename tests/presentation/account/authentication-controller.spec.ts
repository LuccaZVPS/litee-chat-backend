import { AuthenticationController } from "../../../src/presentation/controllers/account/authentication-controller";
import { faker } from "@faker-js/faker";
import { Validator } from "../../../src/presentation/protocols/validator";
import { serverError } from "../../../src/presentation/helpers/http-helper";
describe("Authentication Controller", () => {
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: string }> {
        return { errors: "" };
      }
    }
    return new ValidatorStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    return {
      validatorStub,
      sut: new AuthenticationController(validatorStub),
    };
  };
  const loginDTO = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  test("should call validate method with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    const dto = loginDTO;
    await sut.handle({ body: { ...dto } });
    expect(spy).toBeCalledWith(dto);
  });
  test("should return serverError if validate throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      throw new Error();
    });
    const dto = loginDTO;
    const response = await sut.handle({ body: { ...dto } });
    expect(response).toEqual(serverError());
  });
});
