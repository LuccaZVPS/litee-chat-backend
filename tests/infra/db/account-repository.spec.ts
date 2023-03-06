import { AccountModel } from "../../../src/domain/models/account";
import { mongoHelper } from "../../../src/infra/db/connection";
import { accountModel } from "../../../src/infra/db/models/account-model-db";
import { AccountRepository } from "../../../src/infra/db/repositories/account-repository";
import { createDTO } from "../../presentation/controllers/account/mocks/create-dto";
import { faker } from "@faker-js/faker";
describe("Account Repository", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  afterEach(async () => {
    await accountModel.deleteMany();
  });
  const makeSut = () => {
    return {
      sut: new AccountRepository(),
    };
  };
  describe("CreateAccountRepository", () => {
    test("should call create method with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(accountModel, "create");
      const dto = createDTO;
      await sut.create(dto);
      expect(spy).toHaveBeenCalledWith({ ...dto });
    });
    test("should return correct values", async () => {
      const { sut } = makeSut();
      const dto = createDTO;
      const response = await sut.create(dto);
      expect(response._id).toBeTruthy();
      expect(response.email).toBeTruthy();
      expect(response.friends).toBeTruthy();
      expect(response.name).toBeTruthy();
      expect(response.requests).toBeTruthy();
    });
  });

  describe("FindAccountByEmail", () => {
    test("should call findOne method with correct value", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(accountModel, "findOne");
      const dto = createDTO.email;
      await sut.find(dto);
      expect(spy).toHaveBeenCalledWith({ email: dto });
    });
    test("should return void if findOne returns null", async () => {
      const { sut } = makeSut();
      jest.spyOn(accountModel, "findOne");
      const dto = createDTO.email;
      const response = await sut.find(dto);
      expect(response).toBeFalsy();
    });
    test("should return an account if findOne returns an account", async () => {
      const { sut } = makeSut();
      const accountToFind = await accountModel.create({ ...createDTO });
      const dto = createDTO.email;
      const response = (await sut.find(dto)) as unknown as AccountModel;
      expect(response.email).toBe(accountToFind.email);
    });
  });

  describe("UpdateImageRepository", () => {
    test("should call findOneAndUpdate with correct values", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(accountModel, "findOneAndUpdate");
      await sut.update("any_id", "any_path");
      expect(spy).toHaveBeenCalledWith(
        { _id: "any_id" },
        { $set: { imageURL: "any_path" } }
      );
    });
  });
  describe("ChangePasswordRepository", () => {
    test("should call findOneAndUpdate with correct values", async () => {
      const { sut } = makeSut();
      const spy = jest.spyOn(accountModel, "findOneAndUpdate");
      const accountToUpdate = await accountModel.create({
        email: faker.internet.email(),
        name: faker.internet.userName(),
        password: faker.internet.password,
      });
      await sut.change(accountToUpdate._id, "new_hash");
      expect(spy).toHaveBeenCalledWith(
        { _id: accountToUpdate._id },
        {
          $set: {
            password: "new_hash",
          },
        }
      );
    });
  });
});
