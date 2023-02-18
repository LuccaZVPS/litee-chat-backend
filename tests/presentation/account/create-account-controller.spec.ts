import { CreateAccountController } from "../../../src/presentation/controllers/account/create-account-controller";
import { Validator } from "../../../src/presentation/protocols/validator";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import { createDTO } from "./mocks/create-dto";
import {
  badRequest,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { FindAccountByEmail } from "../../../src/domain/useCases/account/find-account-by-email";
import { AccountModel } from "../../../src/domain/models/account";
import { anyAccount } from "./mocks/fake-account";
describe("Create Account Controller", () => {
  const makeFinByEmailStub = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(email: string): Promise<AccountModel> {
        return anyAccount;
      }
    }
    return new FindByEmailStub();
  };
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
    const findByEmailStub = makeFinByEmailStub();
    return {
      validatorStub,
      findByEmailStub,
      sut: new CreateAccountController(validatorStub, findByEmailStub),
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
  test("should return serverError if validate throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      throw new Error();
    });
    const dto = createDTO;
    const response = await sut.handle({ body: { ...dto } });
    expect(response).toEqual(serverError());
  });
  test("should call findByEmail method with correct value", async () => {
    const { sut, findByEmailStub } = makeSut();
    const spy = jest.spyOn(findByEmailStub, "findByEmail");
    const dto = createDTO;
    await sut.handle({ body: { ...dto } });
    expect(spy).toBeCalledWith(dto.email);
  });
});
