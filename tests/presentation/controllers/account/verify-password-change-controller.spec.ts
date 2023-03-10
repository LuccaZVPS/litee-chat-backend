import { PasswordChangeRequest } from "../../../../src/domain/models/password-change-request";
import { FindPasswordChangeRequest } from "../../../../src/domain/useCases/account/find-password-change";
import { VerifyPasswordChangeController } from "../../../../src/presentation/controllers/account/verify-password-change-controller";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
import {
  badRequest,
  gone,
  notFound,
  ok,
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
      async find(): Promise<void | PasswordChangeRequest> {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
          used: false,
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
  test("should return notFound if find method return void", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest
      .spyOn(findPasswordChangeRequest, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(notFound("request not found"));
  });
  test("should return serverError if find method throws", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest
      .spyOn(findPasswordChangeRequest, "find")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(serverError());
  });
  test("should return gone if find method returns expired changeRequest", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest
      .spyOn(findPasswordChangeRequest, "find")
      .mockImplementationOnce(async () => {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          expiresIn: Date.now() - 1000,
          used: false,
        };
      });
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(gone("expired request"));
  });
  test("should return ok if find method returns valid changeRequest", async () => {
    const { sut } = makeSut();
    const reponse = await sut.handle({
      body: { _id: "any_id", secret: "any_secret" },
    });
    expect(reponse).toEqual(ok("valid link"));
  });
});
