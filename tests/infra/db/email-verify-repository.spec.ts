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
  beforeEach(async () => {
    await emailVerifyModel.deleteMany();
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
    test("should throws if findOne throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(emailVerifyModel, "findOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const response = sut.find("any_id");
      expect(response).rejects.toThrow(new Error());
    });
    test("should return void if findOne fails", async () => {
      const { sut } = makeSut();
      const response = await sut.find("any_id");
      expect(response).toBeFalsy();
    });
    test("should return the correct value", async () => {
      const { sut } = makeSut();
      const verificationToFind = await emailVerifyModel.create({
        accountId: "any_id",
        secret: "any_secret",
      });
      const response = await sut.find(verificationToFind.accountId);
      expect(response).toBe("any_secret");
    });
  });
  describe("CreateVerificationRepository", () => {
    test("should call create method with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(emailVerifyModel, "create");
      await sut.create("any_id", "any_secret");
      expect(spy).toBeCalledWith({ accountId: "any_id", secret: "any_secret" });
    });
  });
});
