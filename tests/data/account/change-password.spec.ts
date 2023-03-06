import { changePasswordRepository } from "../../../src/data/protocols/account-repository/change-password-repository";
import { Hasher } from "../../../src/data/protocols/commom/hasher";
import { DeleteChangeRequestRepository } from "../../../src/data/protocols/passwordChangeRequest-repository/delete-change-request-repository";
import { ChangePassword } from "../../../src/data/useCases/account/change-password";
import { faker } from "@faker-js/faker";
describe("ChangePassword", () => {
  const makeHasherStub = () => {
    class HasherStub implements Hasher {
      hash(str: string): string {
        return "any_hash";
      }
    }
    return new HasherStub();
  };
  const makeChangePasswordRepositoryStub = () => {
    class ChangePasswordRepositoryStub implements changePasswordRepository {
      async change(accountId: string, hash: string): Promise<void> {
        return;
      }
    }
    return new ChangePasswordRepositoryStub();
  };
  const makeDeleteChangeRequest = () => {
    class DeleteChangeRequest implements DeleteChangeRequestRepository {
      async delete(id: string): Promise<void> {
        return;
      }
    }
    return new DeleteChangeRequest();
  };
  const makeSut = () => {
    const hasherStub = makeHasherStub();
    const changePasswordRepositoryStub = makeChangePasswordRepositoryStub();
    const deleteChangeRequestStub = makeDeleteChangeRequest();
    return {
      hasherStub,
      changePasswordRepositoryStub,
      deleteChangeRequestStub,
      sut: new ChangePassword(
        hasherStub,
        changePasswordRepositoryStub,
        deleteChangeRequestStub
      ),
    };
  };
  const DTO = {
    accountId: faker.datatype.uuid(),
    requestId: faker.datatype.uuid(),
    password: faker.internet.password(),
  };
  test("should call hash method with correct value", async () => {
    const { sut, hasherStub } = makeSut();
    const spy = jest.spyOn(hasherStub, "hash");
    await sut.change(DTO.accountId, DTO.password, DTO.requestId);
    expect(spy).toHaveBeenCalledWith(DTO.password);
  });
  test("should throws if hash method throws", () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.change(DTO.accountId, DTO.password, DTO.requestId);
    expect(response).rejects.toThrow(new Error());
  });
  test("should call change method with correct value", async () => {
    const { sut, changePasswordRepositoryStub } = makeSut();
    const spy = jest.spyOn(changePasswordRepositoryStub, "change");
    await sut.change(DTO.accountId, DTO.password, DTO.requestId);
    expect(spy).toHaveBeenCalledWith(DTO.accountId, "any_hash");
  });
  test("should throws if change method throws", async () => {
    const { sut, changePasswordRepositoryStub } = makeSut();
    jest
      .spyOn(changePasswordRepositoryStub, "change")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.change(DTO.accountId, DTO.password, DTO.requestId);
    expect(response).rejects.toThrow(new Error());
  });
});
