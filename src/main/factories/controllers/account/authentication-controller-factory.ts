import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { Validator } from "../../../../validation/validator";
import { makeAuthentication } from "../../useCases/account/authentication-factory";
import { AuthenticationController } from "../../../../presentation/controllers/account/authentication-controller";
export const makeAuthenticationController = () => {
  const classValidator = new ClassValidatorAdapter();
  const validator = new Validator(classValidator);
  const authentication = makeAuthentication();
  return new AuthenticationController(validator, authentication);
};
