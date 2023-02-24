import { mongoHelper } from "../../../src/infra/db/connection";
import { emailVerifyModel } from "../../../src/infra/db/models/email-verify-model-db";
import { EmailVerifyRepository } from "../../../src/infra/db/repositories/email-verify-repository";

describe("EmailVerify Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  const makeSut = () => {
    return {
      sut: new EmailVerifyRepository(),
    };
  };
  describe("FindVerificationRepository", () => {
    test("should call findOne with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(emailVerifyModel, "findOne");
      await sut.find("any_id");
      expect(spy).toBeCalledWith({ accountId: "any_id" });
    });
  });
});
