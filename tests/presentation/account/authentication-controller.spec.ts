import { AuthenticationController } from "../../../src/presentation/controllers/account/authentication-controller";
import { faker } from "@faker-js/faker";
import { Validator } from "../../../src/presentation/protocols/validator";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../../src/presentation/helpers/http-helper";
import { UnauthorizedError } from "../../../src/presentation/errors/unauthorized-error";
import { Authentication } from "../../../src/domain/useCases/account/authentication";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import { AccountSession } from "../../../src/domain/useCases/account/create-account";
describe("Authentication Controller", () => {
  const makeAuthenticationStub = () => {
    class AuthenticationStub implements Authentication {
      async auth(): Promise<false | AccountSession> {
        return {
          _id: "any_id",
          email: "any_email",
          name: "any_name",
          friends: [],
          imageURL: "",
          requests: [],
        };
      }
    }
    return new AuthenticationStub();
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
    const AuthenticationStub = makeAuthenticationStub();
    return {
      validatorStub,
      AuthenticationStub,
      sut: new AuthenticationController(validatorStub, AuthenticationStub),
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
  test("should return badRequest if validate method return errors", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: "any_errors" };
    });
    const dto = loginDTO;
    const response = await sut.handle({ body: { ...dto } });
    expect(response).toEqual(badRequest(new InvalidBody("any_errors")));
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
  test("should call compare method with correct values", async () => {
    const { sut, AuthenticationStub } = makeSut();

    const spy = jest.spyOn(AuthenticationStub, "auth");
    const dto = loginDTO;
    await sut.handle({ body: { ...dto } });
    expect(spy).toBeCalledWith(dto.email, dto.password);
  });
  test("should return unauthorized if auth method return false", async () => {
    const { sut, AuthenticationStub } = makeSut();
    jest.spyOn(AuthenticationStub, "auth").mockImplementationOnce(async () => {
      return false;
    });
    const dto = loginDTO;
    const respnse = await sut.handle({ body: { ...dto } });
    expect(respnse).toEqual(unauthorized(new UnauthorizedError()));
  });
  test("should return ok with an account if compare method return true", async () => {
    const { sut } = makeSut();
    const dto = loginDTO;
    const respnse = await sut.handle({ body: { ...dto } });
    expect(respnse.body).toEqual({
      _id: "any_id",
      email: "any_email",
      name: "any_name",
      friends: [],
      imageURL: "",
      requests: [],
    });
    expect(respnse.statusCode).toBe(200);
  });
});
