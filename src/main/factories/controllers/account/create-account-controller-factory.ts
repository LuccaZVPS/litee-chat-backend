import { ClassValidatorAdapter } from "../../../../infra/utils/class-validator-adapter";
import { CreateAccountController } from "../../../../presentation/controllers/account/create-account-controller";
import { Validator } from "../../../../validation/validator";
import { makeCreateAccount } from "../../useCases/account/create-account-factory";
import { makeFindAccountByEmail } from "../../useCases/account/find-account-by-email-factory";

export const makeCreateAccountController = () => {
  const classValidator = new ClassValidatorAdapter();
  const validator = new Validator(classValidator);
  const createAccount = makeCreateAccount();
  const findAccountByEmail = makeFindAccountByEmail();
  return new CreateAccountController(
    validator,
    findAccountByEmail,
    createAccount
  );
};
