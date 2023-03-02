import { mongoHelper } from "../../../src/infra/db/connection";
import { emailStatusModel } from "../../../src/infra/db/models/email-staus-model-db";
import { EmailStatusRepository } from "../../../src/infra/db/repositories/email-status-repository";

describe("EmailVerify Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  beforeEach(async () => {
    await emailStatusModel.deleteMany();
  });
  const makeSut = () => {
    return {
      sut: new EmailStatusRepository(),
    };
  };
  describe("FindVerificationRepository", () => {
    test("should call findOne with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(emailStatusModel, "findOne");
      await sut.find("any_id");
      expect(spy).toBeCalledWith({ accountId: "any_id" });
    });
    test("should throws if findOne throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(emailStatusModel, "findOne").mockImplementationOnce(() => {
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
      const verificationToFind = await emailStatusModel.create({
        accountId: "any_id",
        secret: "any_secret",
      });
      const response = await sut.find(verificationToFind.accountId);
      expect(response["secret"]).toBe("any_secret");
      expect(response["accountId"]).toBe("any_id");
    });
  });
  describe("CreateVerificationRepository", () => {
    test("should call create method with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(emailStatusModel, "create");
      await sut.create("any_id", "any_secret");
      expect(spy).toBeCalledWith({ accountId: "any_id", secret: "any_secret" });
    });
    test("should throws if create method throws", () => {
      const { sut } = makeSut();
      jest.spyOn(emailStatusModel, "create").mockImplementationOnce(() => {
        throw new Error();
      });
      const response = sut.create("any_id", "any_secret");
      expect(response).rejects.toThrow(new Error());
    });
  });
  describe("EmailVerify", () => {
    test("should call findOneAndUpdate with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(emailStatusModel, "findOneAndUpdate");
      await sut.verify("any_id");
      expect(spy).toBeCalledWith(
        { accountId: "any_id" },
        {
          $set: {
            verified: true,
          },
        }
      );
    });
    test("should verify an account", async () => {
      const { sut } = makeSut();
      await sut.create("any_id", "any_secret");
      await sut.verify("any_id");
      const response = await sut.find("any_id");
      console.log(response);
      expect(response["verified"]).toBe(true);
    });
  });
});
