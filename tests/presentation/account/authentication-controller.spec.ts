import { AuthenticationController } from "../../../src/presentation/controllers/account/authentication-controller";
import { faker } from "@faker-js/faker";
import { Validator } from "../../../src/presentation/protocols/validator";
import {
  serverError,
  unauthorized,
} from "../../../src/presentation/helpers/http-helper";
import { FindAccountByEmail } from "../../../src/domain/useCases/account/find-account-by-email";
import { AccountModel } from "../../../src/domain/models/account";
import { UnauthorizedError } from "../../../src/presentation/errors/unauthorized-error";
describe("Authentication Controller", () => {
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: string }> {
        return { errors: "" };
      }
    }
    return new ValidatorStub();
  };
  const makeFinByEmailStub = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(): Promise<AccountModel | void> {
        return;
      }
    }
    return new FindByEmailStub();
  };
  const makeSut = () => {
    const findByEmailStub = makeFinByEmailStub();
    const validatorStub = makeValidatorStub();
    return {
      validatorStub,
      findByEmailStub,
      sut: new AuthenticationController(validatorStub, findByEmailStub),
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
  test("should call findByEmail method with correct values", async () => {
    const { sut, findByEmailStub } = makeSut();
    const spy = jest.spyOn(findByEmailStub, "findByEmail");
    const dto = loginDTO;
    await sut.handle({ body: { ...dto } });
    expect(spy).toBeCalledWith(dto.email);
  });
  test("should return unauthorized if findByEmail return void", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...loginDTO } });
    expect(response).toEqual(unauthorized(new UnauthorizedError()));
  });
});
