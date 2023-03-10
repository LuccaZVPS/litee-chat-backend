import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { ChangePasswordController } from "../../../../presentation/controllers/account/change-password-controller";
import { Validator } from "../../../../validation/validator";
import { makeChangePassword } from "../../useCases/account/change-password-factory";
import { makeFindPasswordChangeRequest } from "../../useCases/account/find-password-change-request-factory";

export const makeChangePasswordController = () => {
  const classValidator = new ClassValidatorAdapter();
  const valiadtor = new Validator(classValidator);
  return new ChangePasswordController(
    valiadtor,
    makeFindPasswordChangeRequest(),
    makeChangePassword()
  );
};
