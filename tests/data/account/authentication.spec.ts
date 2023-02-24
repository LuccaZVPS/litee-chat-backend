import { CompareHash } from "../../../src/data/protocols/account/compare-hash";
import { FindAccountByEmailRepository } from "../../../src/data/protocols/account/find-account-by-email-repository";
import { Authentication } from "../../../src/data/useCases/account/authentication";
import { AccountModel } from "../../../src/domain/models/account";
import { faker } from "@faker-js/faker";
describe("Authentication", () => {
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
        };
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
    const compareHashStub = makeCompareHashStub();
    return {
      findAccountByEmailRepositoryStub,
      compareHashStub,
      sut: new Authentication(
        findAccountByEmailRepositoryStub,
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
});
