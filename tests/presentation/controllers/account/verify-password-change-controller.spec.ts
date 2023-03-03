import { PasswordChangeRequest } from "../../../../src/domain/models/password-change-request";
import { FindPasswordChangeRequest } from "../../../../src/domain/useCases/account/find-password-change";
import { VerifyPasswordChangeController } from "../../../../src/presentation/controllers/account/verify-password-change-controller";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
import {
  badRequest,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import {
  errorType,
  Validator,
} from "../../../../src/presentation/protocols/validator";

describe("Verify Password Change Controller", () => {
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: errorType[] }> {
        return { errors: [] };
      }
    }
    return new ValidatorStub();
  };
  const makeFindPasswordChangeRequest = () => {
    class FindPasswordChangeRequestStub implements FindPasswordChangeRequest {
      async find(
        id: string,
        secret: string
      ): Promise<void | PasswordChangeRequest> {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
      }
    }
    return new FindPasswordChangeRequestStub();
  };
  const makeSut = () => {
    const validator = makeValidatorStub();
    const findPasswordChangeRequest = makeFindPasswordChangeRequest();
    return {
      validator,
      findPasswordChangeRequest,
      sut: new VerifyPasswordChangeController(
        validator,
        findPasswordChangeRequest
      ),
    };
  };
  test("should call validator with correct values", async () => {
    const { sut, validator } = makeSut();
    const spy = jest.spyOn(validator, "validate");
    await sut.handle({ body: { _id: "any_id", secret: "any_secret" } });
    expect(spy).toHaveBeenCalledWith({ _id: "any_id", secret: "any_secret" });
  });
  test("should return serverError if validator throws", async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, "validate").mockImplementationOnce(async () => {
      throw new Error();
    });
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(serverError());
  });
  test("should return badRequest if validate return errors", async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, "validate").mockImplementationOnce(async () => {
      return { errors: [{ errors: ["any"], field: "any" }] };
    });
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(
      badRequest(new InvalidBody([{ errors: ["any"], field: "any" }]))
    );
  });
  test("should call find method with correct value", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    const spy = jest.spyOn(findPasswordChangeRequest, "find");
    await sut.handle({ body: { _id: "any_id", secret: "any_secret" } });
    expect(spy).toHaveBeenCalledWith("any_id", "any_secret");
  });
});
