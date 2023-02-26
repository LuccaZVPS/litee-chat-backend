import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { Validator } from "../../../../validation/validator";
import { makeEmailVerify } from "../../useCases/account/email-verify-factory";
import { EmailVerifyController } from "../../../../presentation/controllers/account/email-verify-controller";
export const makeEmailVerifyController = () => {
  const classValidator = new ClassValidatorAdapter();
  const validator = new Validator(classValidator);
  const EmailVerify = makeEmailVerify();
  return new EmailVerifyController(validator, EmailVerify);
};
