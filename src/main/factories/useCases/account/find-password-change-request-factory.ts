import { FindPasswordChange } from "../../../../data/useCases/account/find-password-change";
import { makeChangePasswordRequestRepository } from "../../repositories/change-password-request-repository-factory";

export const makeFindPasswordChangeRequest = () => {
  return new FindPasswordChange(makeChangePasswordRequestRepository());
};
