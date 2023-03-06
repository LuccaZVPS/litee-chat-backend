import { CompareHash } from "../../../src/data/protocols/commom/compare-hash";
import { FindAccountByEmailRepository } from "../../../src/data/protocols/account-repository/find-account-by-email-repository";
import { Authentication } from "../../../src/data/useCases/account/authentication";
import { AccountModel } from "../../../src/domain/models/account";
import { faker } from "@faker-js/faker";
import { FindEmailStatusRepository } from "../../../src/data/protocols/emailStatus-repository/find-email-status-repository";
import { EmailStatusModel } from "../../../src/domain/models/email-status";
describe("Authentication", () => {
  const makeFindEmailStatusRepositoryStub = () => {
    class FindEmailStatusRepositoryStub implements FindEmailStatusRepository {
      async find(_id: string): Promise<EmailStatusModel | void> {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          verified: true,
        };
      }
    }
    return new FindEmailStatusRepositoryStub();
  };
  const makeFindByEmailRepository = () => {
    class FindByEmailRepository implements FindAccountByEmailRepository {
      async find(): Promise<void | AccountModel> {
        return {
          _id: "any_id",
          email: "any_email",
          name: "any_name",
          friends: [],
          imageURL: "",
          requests: [],
          password: "any_hash",
          verified: true,
        } as unknown as AccountModel;
      }
    }
    return new FindByEmailRepository();
  };
  const makeCompareHashStub = () => {
    class CompareHashStub implements CompareHash {
      compare(): boolean {
        return true;
      }
    }
    return new CompareHashStub();
  };
  const makeSut = () => {
    const findAccountByEmailRepositoryStub = makeFindByEmailRepository();
    const findEmailStatusRepository = makeFindEmailStatusRepositoryStub();
    const compareHashStub = makeCompareHashStub();
    return {
      findAccountByEmailRepositoryStub,
      findEmailStatusRepository,
      compareHashStub,
      sut: new Authentication(
        findAccountByEmailRepositoryStub,
        findEmailStatusRepository,
        compareHashStub
      ),
    };
  };
  const dto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  test("should call find method with correct value", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const spy = jest.spyOn(findAccountByEmailRepositoryStub, "find");
    await sut.auth(dto.email, dto.password);
    expect(spy).toHaveBeenCalledWith(dto.email);
  });
  test("should throws if find method throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "find")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = sut.auth(dto.email, dto.password);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return false if find method return void", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.auth(dto.email, dto.password);
    expect(response).toBe(false);
  });
  test("should call findEmailStatus with correct value", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    const spy = jest.spyOn(findEmailStatusRepository, "find");
    await sut.auth(dto.email, dto.password);
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  test("should return false if findEmailStatus returns void", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    const spy = jest
      .spyOn(findEmailStatusRepository, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    await sut.auth(dto.email, dto.password);
    expect(spy).toHaveBeenCalledWith("any_id");
  });
  test("should return false if email is not verified yet", async () => {
    const { sut, findEmailStatusRepository } = makeSut();
    jest
      .spyOn(findEmailStatusRepository, "find")
      .mockImplementationOnce(async () => {
        return {
          verified: false,
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
        };
      });

    const response = await sut.auth(dto.email, dto.password);
    expect(response).toBe(false);
  });
  test("should call compare method with correct value", async () => {
    const { sut, compareHashStub } = makeSut();
    const spy = jest.spyOn(compareHashStub, "compare");
    await sut.auth(dto.email, dto.password);
    expect(spy).toHaveBeenCalledWith(dto.password, "any_hash");
  });
  test("should throws if compare method throws", () => {
    const { sut, compareHashStub } = makeSut();
    jest.spyOn(compareHashStub, "compare").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.auth(dto.email, dto.password);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return false if compare method return false", async () => {
    const { sut, compareHashStub } = makeSut();
    jest.spyOn(compareHashStub, "compare").mockImplementationOnce(() => {
      return false;
    });
    const response = await sut.auth(dto.email, dto.password);
    expect(response).toBe(false);
  });
  test("should return an account if compare method return true", async () => {
    const { sut } = makeSut();
    const response = await sut.auth(dto.email, dto.password);
    expect(response).toEqual({
      _id: "any_id",
      email: "any_email",
      name: "any_name",
      friends: [],
      imageURL: "",
      requests: [],
      password: "any_hash",
      verified: true,
    });
  });
});
