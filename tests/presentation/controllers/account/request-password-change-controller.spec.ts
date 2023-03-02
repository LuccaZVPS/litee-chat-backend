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
  notFound,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
import { RequestPasswordChange } from "../../../../src/domain/useCases/account/request-password-change";
import { anyAccount } from "./mocks/fake-account";
describe("Request password change controller", () => {
  const accountMock = anyAccount;
  const makeFindAccountByEmail = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(): Promise<AccountModel | void> {
        return accountMock;
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
  const makeRequestPasswordChangeStub = () => {
    class RequestPasswordChangeStub implements RequestPasswordChange {
      async createRequest(accountId: string): Promise<void> {
        return;
      }
    }
    return new RequestPasswordChangeStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    const findAccountByEmail = makeFindAccountByEmail();
    const requestPasswordChangeStub = makeRequestPasswordChangeStub();
    return {
      validatorStub,
      findAccountByEmail,
      requestPasswordChangeStub,
      sut: new RequestPasswordChangeController(
        validatorStub,
        findAccountByEmail,
        requestPasswordChangeStub
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
  test("should call find method with correct value", async () => {
    const { sut, findAccountByEmail } = makeSut();
    const spy = jest.spyOn(findAccountByEmail, "findByEmail");
    await sut.handle({ body: { email: anyEmail } });
    expect(spy).toHaveBeenCalledWith(anyEmail);
  });
  test("should returns serverError if find method throws", async () => {
    const { sut, findAccountByEmail } = makeSut();
    jest.spyOn(findAccountByEmail, "findByEmail").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ body: { email: anyEmail } });
    expect(response).toEqual(serverError());
  });
  test("should return notFound if findByEmail return void", async () => {
    const { sut, findAccountByEmail } = makeSut();
    jest
      .spyOn(findAccountByEmail, "findByEmail")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.handle({ body: { email: anyEmail } });
    expect(response).toEqual(notFound("email cant be found"));
  });
  test("should call createRequest with correct value", async () => {
    const { sut, requestPasswordChangeStub } = makeSut();
    const spy = jest.spyOn(requestPasswordChangeStub, "createRequest");
    await sut.handle({ body: { email: anyEmail } });
    expect(spy).toHaveBeenCalledWith(accountMock._id);
  });
  test("should return serverError if createRequest throws", async () => {
    const { sut, requestPasswordChangeStub } = makeSut();
    jest
      .spyOn(requestPasswordChangeStub, "createRequest")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = await sut.handle({ body: { email: anyEmail } });
    expect(response).toEqual(serverError());
  });
});
