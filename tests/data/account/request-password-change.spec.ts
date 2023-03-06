import { CreateChangeRequestRepository } from "../../../src/data/protocols/account/create-change-request-repository";
import { GeneratePassword } from "../../../src/data/protocols/account/generate-password";
import { SendChangePasswordEmail } from "../../../src/data/protocols/account/send-change-password-email";
import { RequestPasswordChange } from "../../../src/data/useCases/account/request-password-change";

describe("RequestPasswordChange", () => {
  const makeGeneratePasswordStub = () => {
    class GeneratePasswordStub implements GeneratePassword {
      generate(): string {
        return "any_secret";
      }
    }
    return new GeneratePasswordStub();
  };
  const makeCreateChangeRequestStub = () => {
    class CreateChangeRequestStub implements CreateChangeRequestRepository {
      async create(accountId: string, secret: string): Promise<void> {
        return;
      }
    }
    return new CreateChangeRequestStub();
  };
  const makeSendChangePasswordEmailStub = () => {
    class SendChangePasswordEmailStub implements SendChangePasswordEmail {
      async send(accountId: string, secret: string): Promise<void> {
        return;
      }
    }
    return new SendChangePasswordEmailStub();
  };
  const makeSut = () => {
    const generatePasswordStub = makeGeneratePasswordStub();
    const createChangeRequestStub = makeCreateChangeRequestStub();
    const sendChangeEmailStub = makeSendChangePasswordEmailStub();
    return {
      generatePasswordStub,
      createChangeRequestStub,
      sendChangeEmailStub,
      sut: new RequestPasswordChange(
        generatePasswordStub,
        createChangeRequestStub,
        sendChangeEmailStub
      ),
    };
  };
  test("should call generate method with correct value", async () => {
    const { sut, generatePasswordStub } = makeSut();
    const spy = jest.spyOn(generatePasswordStub, "generate");
    await sut.createRequest("any_id");
    expect(spy).toHaveBeenCalled();
  });
  test("should throws if generate method throws", () => {
    const { sut, generatePasswordStub } = makeSut();
    jest.spyOn(generatePasswordStub, "generate").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.createRequest("any_id");
    expect(response).rejects.toThrow(new Error());
  });
  test("should call createChangeRequest with correct value", async () => {
    const { sut, createChangeRequestStub } = makeSut();
    const spy = jest.spyOn(createChangeRequestStub, "create");
    await sut.createRequest("any_id");
    expect(spy).toHaveBeenCalledWith("any_id", "any_secret");
  });
});
