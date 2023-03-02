import { EmailVerifyRepository } from "../../../src/data/protocols/account/email-verify-repository";
import { FindEmailStatusRepository } from "../../../src/data/protocols/account/find-email-status-repository";
import { EmailVerify } from "../../../src/data/useCases/account/email-verify";
import { EmailStatusModel } from "../../../src/domain/models/email-status";

describe("Email verify", () => {
  const emailStatusMock = {
    _id: "any_id",
    accountId: "any_id",
    secret: "any_secret",
    verified: false,
  };
  const makeFindSecretStub = () => {
    class FindEmailStatusRepositoryStub implements FindEmailStatusRepository {
      async find(_id: string): Promise<EmailStatusModel | void> {
        return emailStatusMock;
      }
    }
    return new FindEmailStatusRepositoryStub();
  };
  const makeEmailVerifyRepositoryStub = () => {
    class EmailVerifyRepositoryStub implements EmailVerifyRepository {
      async verify(): Promise<void> {
        return;
      }
    }
    return new EmailVerifyRepositoryStub();
  };
  const makeSut = () => {
    const findEmailStatusRepository = makeFindSecretStub();
    const emailVerifyRepository = makeEmailVerifyRepositoryStub();
    return {
      findEmailStatusRepository,
      emailVerifyRepository,
      sut: new EmailVerify(findEmailStatusRepository, emailVerifyRepository),
    };
  };
  test("should call find method with correct value", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    const spy = jest.spyOn(findEmailStatusRepository, "find");
    await sut.verify("any_id", "any_secret");
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  test("should throw if find method throws", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    jest.spyOn(findEmailStatusRepository, "find").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.verify("any_id", "any_secret");
    expect(response).rejects.toThrow(new Error());
  });
  test("should return false if wrong secret is provided", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    jest
      .spyOn(findEmailStatusRepository, "find")
      .mockImplementationOnce(async () => {
        return { ...emailStatusMock, secret: "wrong_secret" };
      });
    const response = await sut.verify("any_id", "any_secret");
    expect(response).toBe(false);
  });
  test("should return false if emailStatus cant be found", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    jest
      .spyOn(findEmailStatusRepository, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.verify("any_id", "any_secret");
    expect(response).toBe(false);
  });
  test("should call verify with correct value", async () => {
    const { sut, emailVerifyRepository } = makeSut();
    const spy = jest.spyOn(emailVerifyRepository, "verify");
    await sut.verify("any_id", "any_secret");
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  test("should throw if verify method throws", async () => {
    const { sut, emailVerifyRepository } = makeSut();
    jest.spyOn(emailVerifyRepository, "verify").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.verify("any_id", "any_secret");
    expect(response).rejects.toThrow(new Error());
  });
  test("should return true", async () => {
    const { sut } = makeSut();
    const response = await sut.verify("any_id", "any_secret");
    expect(response).toBe(true);
  });
});
