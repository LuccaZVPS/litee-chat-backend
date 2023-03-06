import { FindPasswordChangeRepository } from "../../../src/data/protocols/account/find-password-change-repository";
import { FindPasswordChange } from "../../../src/data/useCases/account/find-password-change";
import { PasswordChangeRequest } from "../../../src/domain/models/password-change-request";
import { faker } from "@faker-js/faker";
describe("FindPasswordChange", () => {
  const changePasswordDTO = {
    _id: faker.datatype.uuid(),
    secret: "any_secret",
  };
  const makeFindPasswordChangeRepositoryStub = () => {
    class FindPasswordChangeRepositoryStub
      implements FindPasswordChangeRepository
    {
      async find(
        _id: string,
        secret: string
      ): Promise<void | PasswordChangeRequest> {
        return {
          _id: "any_id",
          accountId: "any_id",
          secret: "any_secret",
          expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
      }
    }
    return new FindPasswordChangeRepositoryStub();
  };
  const makeSut = () => {
    const findPasswordChangeRepositoryStub =
      makeFindPasswordChangeRepositoryStub();
    return {
      findPasswordChangeRepositoryStub,
      sut: new FindPasswordChange(findPasswordChangeRepositoryStub),
    };
  };
  test("should call find method with correct values", async () => {
    const { sut, findPasswordChangeRepositoryStub } = makeSut();
    const spy = jest.spyOn(findPasswordChangeRepositoryStub, "find");
    await sut.find(changePasswordDTO._id, changePasswordDTO.secret);
    expect(spy).toHaveBeenCalledWith(
      changePasswordDTO._id,
      changePasswordDTO.secret
    );
  });
  test("should throws if find method throws", async () => {
    const { sut, findPasswordChangeRepositoryStub } = makeSut();
    jest
      .spyOn(findPasswordChangeRepositoryStub, "find")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.find(changePasswordDTO._id, changePasswordDTO.secret);
    expect(response).rejects.toThrow(new Error());
  });
});
