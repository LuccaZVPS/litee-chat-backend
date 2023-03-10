import { FindAccountByEmailRepository } from "../../../src/data/protocols/account-repository/find-account-by-email-repository";
import { FindAccountByEmail } from "../../../src/data/useCases/account/find-account-by-email";
import { AccountModel } from "../../../src/domain/models/account";
import { anyAccount } from "../../presentation/controllers/account/mocks/fake-account";
import { faker } from "@faker-js/faker";
describe("FindAccountByEmail", () => {
  const makeFindAccountByEmailRepository = () => {
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async find(): Promise<void | AccountModel> {
        return anyAccount;
      }
    }
    return new FindAccountByEmailRepositoryStub();
  };
  const makeSut = () => {
    const findAccountByEmailRepository = makeFindAccountByEmailRepository();
    return {
      findAccountByEmailRepository,
      sut: new FindAccountByEmail(findAccountByEmailRepository),
    };
  };
  const emailMock = faker.internet.email();

  test("should call find method with correct value", async () => {
    const { sut, findAccountByEmailRepository } = makeSut();
    const spy = jest.spyOn(findAccountByEmailRepository, "find");
    await sut.findByEmail(emailMock);
    expect(spy).toHaveBeenCalledWith(emailMock);
  });
  test("should throws if find method throws", async () => {
    const { sut, findAccountByEmailRepository } = makeSut();
    jest
      .spyOn(findAccountByEmailRepository, "find")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.findByEmail(emailMock);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return void if find method return void", async () => {
    const { sut, findAccountByEmailRepository } = makeSut();
    jest
      .spyOn(findAccountByEmailRepository, "find")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.findByEmail(emailMock);
    expect(response).toBeUndefined();
  });

  test("should return an account if find method return an account", async () => {
    const { sut } = makeSut();
    const response = await sut.findByEmail(emailMock);
    expect(response).toHaveProperty("_id");
  });
});
