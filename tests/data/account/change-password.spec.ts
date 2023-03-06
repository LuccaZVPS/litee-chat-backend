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
});
