import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { VerifyPasswordChangeController } from "../../../../presentation/controllers/account/verify-password-change-controller";
import { Validator } from "../../../../validation/validator";
import { makeFindPasswordChangeRequest } from "../../useCases/account/find-password-change-request-factory";

export const makeVerifyChangeRequest = () => {
  const classValidator = new ClassValidatorAdapter();
  const validator = new Validator(classValidator);
  return new VerifyPasswordChangeController(
    validator,
    makeFindPasswordChangeRequest()
  );
};
