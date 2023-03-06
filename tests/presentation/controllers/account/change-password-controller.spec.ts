import { PasswordChangeRequest } from "../../../../src/domain/models/password-change-request";
import { ChangePassword } from "../../../../src/domain/useCases/account/change-password";
import { FindPasswordChangeRequest } from "../../../../src/domain/useCases/account/find-password-change";
import { ChangePasswordController } from "../../../../src/presentation/controllers/account/change-password-controller";
import {
  errorType,
  Validator,
} from "../../../../src/presentation/protocols/validator";
import { faker } from "@faker-js/faker";
import {
  badRequest,
  gone,
  notFound,
  ok,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
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
          used: false,
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
  test("should return server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(serverError());
  });
  test("should return badRequest if validator returns errors", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: [{ errors: ["any"], field: "any" }] };
    });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(
      badRequest(new InvalidBody([{ errors: ["any"], field: "any" }]))
    );
  });
  test("should call find method with correct values", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    const spy = jest.spyOn(findPasswordChangeRequest, "find");
    await sut.handle({ body: { ...changePasswordDTO } });
    expect(spy).toHaveBeenCalledWith(
      changePasswordDTO._id,
      changePasswordDTO.secret
    );
  });
  test("should return serverError if find method throws", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest.spyOn(findPasswordChangeRequest, "find").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(serverError());
  });
  test("should return notFound if find method returns void", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest
      .spyOn(findPasswordChangeRequest, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(notFound("change password request not found"));
  });
  test("should return gone if request is expired", async () => {
    const { sut, findPasswordChangeRequest } = makeSut();
    jest
      .spyOn(findPasswordChangeRequest, "find")
      .mockImplementationOnce(async () => {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          expiresIn: Date.now() - 7 * 24 * 60 * 60 * 1000,
          used: false,
        };
      });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(gone("request already expired"));
  });
  test("should call change password with correct value", async () => {
    const { sut, changePasswordStub } = makeSut();
    const spy = jest.spyOn(changePasswordStub, "change");
    await sut.handle({ body: { ...changePasswordDTO } });
    expect(spy).toHaveBeenCalledWith(
      changePasswordDTO._id,
      changePasswordDTO.password,
      "any_id"
    );
  });
  test("should return serverError if change password throws", async () => {
    const { sut, changePasswordStub } = makeSut();
    jest.spyOn(changePasswordStub, "change").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(serverError());
  });
  test("should return ok status code", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ body: { ...changePasswordDTO } });
    expect(response).toEqual(ok("password changed"));
  });
});
