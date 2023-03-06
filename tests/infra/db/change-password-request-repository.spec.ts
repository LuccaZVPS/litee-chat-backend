import { mongoHelper } from "../../../src/infra/db/connection";
import { changePasswordRequestModel } from "../../../src/infra/db/models/change-password-request";
import { ChangePasswordRequestRepository } from "../../../src/infra/db/repositories/change-password-request-repository";

describe("ChangePasswordRequest Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  const makeSut = () => {
    return {
      sut: new ChangePasswordRequestRepository(),
    };
  };
  describe("CreateChangeRequestRepository", () => {
    test("should call create method with correct values", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(changePasswordRequestModel, "create");
      await sut.create("any_id", "any_secret");
      expect(spy).toHaveBeenCalledWith({
        accountId: "any_id",
        secret: "any_secret",
      });
    });
  });
});
