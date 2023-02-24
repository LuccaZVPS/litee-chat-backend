import { mongoHelper } from "../../../src/infra/db/connection";
import { accountModel } from "../../../src/infra/db/models/account-model-db";
import { AccountRepository } from "../../../src/infra/db/repositories/account-repository";
import { createDTO } from "../../presentation/account/mocks/create-dto";
describe("Account Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  const makeSut = () => {
    return {
      sut: new AccountRepository(),
    };
  };
  test("should call create method with correct value", async () => {
    const { sut } = makeSut();
    const spy = jest.spyOn(accountModel, "create");
    const dto = createDTO;
    await sut.create(dto);
    expect(spy).toHaveBeenCalledWith({ ...dto });
  });
});
