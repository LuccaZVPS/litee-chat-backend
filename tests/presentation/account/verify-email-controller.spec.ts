import { EmailVerifyController } from "../../../src/presentation/controllers/account/email-verify-controller";
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
});
