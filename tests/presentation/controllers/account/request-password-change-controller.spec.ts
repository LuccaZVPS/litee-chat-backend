import { AccountModel } from "../../../../src/domain/models/account";
import { FindAccountByEmail } from "../../../../src/domain/useCases/account/find-account-by-email";
import { RequestPasswordChangeController } from "../../../../src/presentation/controllers/account/request-password-change";
import {
  errorType,
  Validator,
} from "../../../../src/presentation/protocols/validator";
import { faker } from "@faker-js/faker";
import {
  badRequest,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
describe("Request password change controller", () => {
  const makeFindAccountByEmail = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(): Promise<AccountModel | void> {
        return;
      }
    }
    return new FindByEmailStub();
  };
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: errorType[] }> {
        return { errors: [] };
      }
    }
    return new ValidatorStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    const findAccountByEmail = makeFindAccountByEmail();
    return {
      validatorStub,
      findAccountByEmail,
      sut: new RequestPasswordChangeController(
        validatorStub,
        findAccountByEmail
      ),
    };
  };
  const anyEmail = faker.internet.email();
  test("should call validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    await sut.handle({ body: { email: anyEmail } });
    expect(spy).toHaveBeenCalledWith({ email: anyEmail });
  });
  test("should return server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ body: { email: anyEmail } });
    expect(response).toEqual(serverError());
  });
  test("should return badRequest if validator returns errors", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: [{ errors: ["any"], field: "any" }] };
    });
    const response = await sut.handle({ body: { email: anyEmail } });
    expect(response).toEqual(
      badRequest(new InvalidBody([{ errors: ["any"], field: "any" }]))
    );
  });
});
