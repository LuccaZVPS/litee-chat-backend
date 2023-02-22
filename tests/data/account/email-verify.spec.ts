import { EmailVerifyRepository } from "../../../src/data/protocols/account/email-verify-repository";
import { FindSecret } from "../../../src/data/protocols/account/find-secrect";
import { EmailVerify } from "../../../src/data/useCases/account/email-verify";

describe("Email verify", () => {
  const makeFindSecretStub = () => {
    class FindSecretStub implements FindSecret {
      async find(_id: string): Promise<string | void> {
        return "any_secret";
      }
    }
    return new FindSecretStub();
  };
  const makeEmailVerifyRepositoryStub = () => {
    class EmailVerifyRepositoryStub implements EmailVerifyRepository {
      async verify(_id: string): Promise<void> {
        return;
      }
    }
    return new EmailVerifyRepositoryStub();
  };
  const makeSut = () => {
    const findSecretSutb = makeFindSecretStub();
    const emailVerifyRepository = makeEmailVerifyRepositoryStub();
    return {
      findSecretSutb,
      emailVerifyRepository,
      sut: new EmailVerify(findSecretSutb, emailVerifyRepository),
    };
  };
  test("should call find method with correct value", async () => {
    const { sut, findSecretSutb } = makeSut();
    const spy = jest.spyOn(findSecretSutb, "find");
    await sut.verify("any_id", "any_secret");
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  test("should throw if find method throws", async () => {
    const { sut, findSecretSutb } = makeSut();
    const spy = jest
      .spyOn(findSecretSutb, "find")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.verify("any_id", "any_secret");
    expect(response).rejects.toThrow(new Error());
  });
  test("should return false if find method dont return a secret", async () => {
    const { sut, findSecretSutb } = makeSut();
    jest.spyOn(findSecretSutb, "find").mockImplementationOnce(async () => {
      return "";
    });
    const response = await sut.verify("any_id", "any_secret");
    expect(response).toBe(false);
  });
});