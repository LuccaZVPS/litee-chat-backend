import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { RequestPasswordChangeController } from "../../../../presentation/controllers/account/request-password-change";
import { Validator } from "../../../../validation/validator";
import { makeFindAccountByEmail } from "../../useCases/account/find-account-by-email-factory";
import { makeRequestPasswordChange } from "../../useCases/account/request-password-change-factory";

export const makeRequestPasswordChangeController = () => {
  const classValidator = new ClassValidatorAdapter();
  const validator = new Validator(classValidator);
  const findAccount = makeFindAccountByEmail();
  const requestChange = makeRequestPasswordChange();
  return new RequestPasswordChangeController(
    validator,
    findAccount,
    requestChange
  );
};
