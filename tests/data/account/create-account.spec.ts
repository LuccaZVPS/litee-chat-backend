import { CreateAccountRepository } from "../../../src/data/protocols/account/create-account-repository";
import { CreateVerificationRepository } from "../../../src/data/protocols/account/create-verification-repository";
import { GeneratePassword } from "../../../src/data/protocols/account/generate-password";
import { Hasher } from "../../../src/data/protocols/account/hasher";
import { SendVerificationEmail } from "../../../src/data/protocols/account/send-verification-emai";
import { CreateAccount } from "../../../src/data/useCases/account/create-account";
import { AccountSession } from "../../../src/domain/useCases/account/create-account";
import { createDTO } from "../../presentation/account/mocks/create-dto";
describe("Create Account", () => {
  const makeGeneratePassword = () => {
    class GeneratePasswordStub implements GeneratePassword {
      generate(): string {
        return "any_password";
      }
    }
    return new GeneratePasswordStub();
  };
  const makeCreateVerification = () => {
    class CreateVerificationRepositoryStub
      implements CreateVerificationRepository
    {
      async create(): Promise<void> {
        return;
      }
    }
    return new CreateVerificationRepositoryStub();
  };
  const makeSendVerificationEmail = () => {
    class SendVerificationEmailStub implements SendVerificationEmail {
      async send(): Promise<void> {
        return;
      }
    }
    return new SendVerificationEmailStub();
  };
  const makeHasherStub = () => {
    class HasherStub implements Hasher {
      hash(): string {
        return "any_hash";
      }
    }
    return new HasherStub();
  };
  const makeCreateAccountRepositoryStub = () => {
    class CreateAccountRepositoryStub implements CreateAccountRepository {
      async create(): Promise<AccountSession> {
        return {
          _id: "any_id",
          email: "any_email",
          name: "any_name",
          friends: [],
          imageURL: "",
          requests: [],
        };
      }
    }
    return new CreateAccountRepositoryStub();
  };
  const makeSut = () => {
    const createAccountRepositoryStub = makeCreateAccountRepositoryStub();
    const hashStub = makeHasherStub();
    const generatePasswordStub = makeGeneratePassword();
    const createVerificationStub = makeCreateVerification();
    const sendVerificationEmailStub = makeSendVerificationEmail();
    return {
      createAccountRepositoryStub,
      hashStub,
      generatePasswordStub,
      createVerificationStub,
      sendVerificationEmailStub,
      sut: new CreateAccount(
        hashStub,
        createAccountRepositoryStub,
        generatePasswordStub,
        createVerificationStub,
        sendVerificationEmailStub
      ),
    };
  };
  test("should call hash method with correct value", async () => {
    const { sut, hashStub } = makeSut();
    const spy = jest.spyOn(hashStub, "hash");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith(dto.password);
  });
  test("should throws if hash method throws", async () => {
    const { sut, hashStub } = makeSut();
    jest.spyOn(hashStub, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const dto = { ...createDTO };
    const response = sut.create(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should call create method with correct value", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    const spy = jest.spyOn(createAccountRepositoryStub, "create");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith({ ...dto, password: "any_hash" });
  });
  test("should throws if create method throws", () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    jest
      .spyOn(createAccountRepositoryStub, "create")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const dto = { ...createDTO };
    const response = sut.create(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should throws if create method dont return an account", () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    jest
      .spyOn(createAccountRepositoryStub, "create")
      .mockImplementationOnce(async () => {
        return {} as AccountSession;
      });
    const dto = { ...createDTO };
    const response = sut.create(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should return account data", async () => {
    const { sut } = makeSut();
    const dto = { ...createDTO };

    const accountData = await sut.create(dto);
    expect(accountData).toEqual({
      _id: "any_id",
      email: "any_email",
      name: "any_name",
      friends: [],
      imageURL: "",
      requests: [],
    });
  });
  test("should call generate password method", async () => {
    const { sut, generatePasswordStub } = makeSut();
    const spy = jest.spyOn(generatePasswordStub, "generate");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalled();
  });
  test("should throws if generate password throws", () => {
    const { sut, generatePasswordStub } = makeSut();
    jest.spyOn(generatePasswordStub, "generate").mockImplementationOnce(() => {
      throw new Error();
    });
    const dto = { ...createDTO };
    const response = sut.create(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should call createVerication with correct values", async () => {
    const { sut, createVerificationStub } = makeSut();
    const spy = jest.spyOn(createVerificationStub, "create");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith("any_id", "any_password");
  });
  test("should throws if createVerification throws", () => {
    const { sut, createVerificationStub } = makeSut();
    jest.spyOn(createVerificationStub, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const dto = { ...createDTO };
    const response = sut.create(dto);
    expect(response).rejects.toThrow(new Error());
  });
  test("should call sendVerificationEmail with correct value", async () => {
    const { sut, sendVerificationEmailStub } = makeSut();
    const spy = jest.spyOn(sendVerificationEmailStub, "send");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith(
      "any_name",
      "any_email",
      "any_id",
      "any_password"
    );
  });
});
