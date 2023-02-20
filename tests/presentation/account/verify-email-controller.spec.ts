import { EmailVerifyController } from "../../../src/presentation/controllers/account/email-verify-controller";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import {
  badRequest,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { Validator } from "../../../src/presentation/protocols/validator";

describe("Verify email controller", () => {
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
    return {
      validatorStub,
      sut: new EmailVerifyController(validatorStub),
    };
  };
  const verifyEmailDTO = {
    _id: "any_id",
    password: "any_password",
  };
  test("should call validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    await sut.handle({ body: verifyEmailDTO });
    expect(spy).toHaveBeenCalledWith({ ...verifyEmailDTO });
  });
  test("should return badRequest with invalidBody error", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: "any_error" };
    });
    const response = await sut.handle({ body: { ...verifyEmailDTO } });
    expect(response).toEqual(badRequest(new InvalidBody("any_error")));
  });
  test("should return serverError if validate throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      throw new Error();
    });
    const response = await sut.handle({ body: { ...verifyEmailDTO } });
    expect(response).toEqual(serverError());
  });
});
