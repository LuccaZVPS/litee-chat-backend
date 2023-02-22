import { CreateAccountRepository } from "../../../src/data/protocols/account/create-account-repository";
import { Hasher } from "../../../src/data/protocols/account/hasher";
import { CreateAccount } from "../../../src/data/useCases/account/create-account";
import { AccountSession } from "../../../src/domain/useCases/account/create-account";
import { createDTO } from "../../presentation/account/mocks/create-dto";
describe("Create Account", () => {
  const makeHasherStub = () => {
    class HasherStub implements Hasher {
      hash(str: string): string {
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
    return {
      createAccountRepositoryStub,
      hashStub,
      sut: new CreateAccount(hashStub, createAccountRepositoryStub),
    };
  };
  test("should call hash method with correct value", async () => {
    const { sut, hashStub } = makeSut();
    const spy = jest.spyOn(hashStub, "hash");
    const dto = { ...createDTO };
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith(dto.password);
  });
});
