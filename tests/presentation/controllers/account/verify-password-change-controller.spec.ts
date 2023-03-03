import { PasswordChangeRequest } from "../../../../src/domain/models/password-change-request";
import { FindPasswordChangeRequest } from "../../../../src/domain/useCases/account/find-password-change";
import { VerifyPasswordChangeController } from "../../../../src/presentation/controllers/account/verify-password-change-controller";
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
});
