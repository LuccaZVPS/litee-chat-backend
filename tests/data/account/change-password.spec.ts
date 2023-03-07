import { changePasswordRepository } from "../../../src/data/protocols/account-repository/change-password-repository";
import { Hasher } from "../../../src/data/protocols/commom/hasher";
import { ChangePassword } from "../../../src/data/useCases/account/change-password";
import { faker } from "@faker-js/faker";
import { UpdateUsedRequest } from "../../../src/data/protocols/passwordChangeRequest-repository/update-used-request-factory";
describe("ChangePassword", () => {
  const makeHasherStub = () => {
    class HasherStub implements Hasher {
      hash(): string {
        return "any_hash";
      }
    }
    return new HasherStub();
  };
  const makeChangePasswordRepositoryStub = () => {
    class ChangePasswordRepositoryStub implements changePasswordRepository {
      async change(): Promise<void> {
        return;
      }
    }
    return new ChangePasswordRepositoryStub();
  };
  const makeUpdateUsedRequestStub = () => {
    class UpdateUsedRequestStub implements UpdateUsedRequest {
      async updateToUsed(): Promise<void> {
        return;
      }
    }
    return new UpdateUsedRequestStub();
  };
  const makeSut = () => {
    const hasherStub = makeHasherStub();
    const changePasswordRepositoryStub = makeChangePasswordRepositoryStub();
    const updateUsedRequest = makeUpdateUsedRequestStub();
    return {
      hasherStub,
      changePasswordRepositoryStub,
      updateUsedRequest,
      sut: new ChangePassword(
        hasherStub,
        changePasswordRepositoryStub,
        updateUsedRequest
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
    await sut.change(DTO.accountId, DTO.password, "any_request_id");
    expect(spy).toHaveBeenCalledWith(DTO.password);
  });
  test("should throws if hash method throws", () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.change(DTO.accountId, DTO.password, "any_request_id");
    expect(response).rejects.toThrow(new Error());
  });
  test("should call change method with correct value", async () => {
    const { sut, changePasswordRepositoryStub } = makeSut();
    const spy = jest.spyOn(changePasswordRepositoryStub, "change");
    await sut.change(DTO.accountId, DTO.password, "any_request_id");
    expect(spy).toHaveBeenCalledWith(DTO.accountId, "any_hash");
  });
  test("should throws if change method throws", async () => {
    const { sut, changePasswordRepositoryStub } = makeSut();
    jest
      .spyOn(changePasswordRepositoryStub, "change")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.change(DTO.accountId, DTO.password, "any_request_id");
    expect(response).rejects.toThrow(new Error());
  });
  test("should call updateToUsed method with correct value", async () => {
    const { sut, updateUsedRequest } = makeSut();
    const spy = jest.spyOn(updateUsedRequest, "updateToUsed");
    await sut.change(DTO.accountId, DTO.password, "any_request_id");
    expect(spy).toHaveBeenCalledWith("any_request_id");
  });
});
