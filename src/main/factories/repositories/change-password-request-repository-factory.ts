import { ChangePasswordRequestRepository } from "../../../infra/db/repositories/change-password-request-repository";

export const makeChangePasswordRequestRepository = () => {
  return new ChangePasswordRequestRepository();
};
