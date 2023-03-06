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
  describe("FindChangeRequestRepository", () => {
    test("should call findOne with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(changePasswordRequestModel, "findOne");
      await sut.find("any_id", "any_secret");
      expect(spy).toHaveBeenCalledWith({
        accountId: "any_id",
        secret: "any_secret",
      });
    });
    test("should return an request", async () => {
      const { sut } = makeSut();
      const requestToFind = await changePasswordRequestModel.create({
        accountId: "any_id_to_find",
        secret: "any",
      });
      const response = await sut.find("any_id_to_find", "any");
      expect(response["accountId"]).toEqual(requestToFind.accountId);
    });
  });
});
