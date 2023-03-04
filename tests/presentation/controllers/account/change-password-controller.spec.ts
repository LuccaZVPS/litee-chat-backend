import { PasswordChangeRequest } from "../../../../src/domain/models/password-change-request";
import { ChangePassword } from "../../../../src/domain/useCases/account/change-password";
import { FindPasswordChangeRequest } from "../../../../src/domain/useCases/account/find-password-change";
import { ChangePasswordController } from "../../../../src/presentation/controllers/account/change-password-controller";
import {
  errorType,
  Validator,
} from "../../../../src/presentation/protocols/validator";
import { faker } from "@faker-js/faker";
describe("ChangePasswordController", () => {
  const changePasswordDTO = {
    _id: faker.datatype.uuid(),
    secret: "any_secret",
    password: faker.internet.password(),
  };
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: errorType[] }> {
        return { errors: [] };
      }
    }
    return new ValidatorStub();
  };
  const makeFindPasswordChangeRequestStub = () => {
    class FindPasswordChangeRequestStub implements FindPasswordChangeRequest {
      async find(): Promise<void | PasswordChangeRequest> {
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
  const makeChangePasswordStub = () => {
    class ChangePasswordStub implements ChangePassword {
      async change(): Promise<void> {
        return;
      }
    }
    return new ChangePasswordStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    const findPasswordChangeRequest = makeFindPasswordChangeRequestStub();
    const changePasswordStub = makeChangePasswordStub();
    return {
      validatorStub,
      findPasswordChangeRequest,
      changePasswordStub,
      sut: new ChangePasswordController(
        validatorStub,
        findPasswordChangeRequest,
        changePasswordStub
      ),
    };
  };
  test("should call validator with correct value", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    await sut.handle({ body: { ...changePasswordDTO } });
    expect(spy).toHaveBeenCalledWith({ ...changePasswordDTO });
  });
});
