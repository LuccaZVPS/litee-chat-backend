import { mongoHelper } from "../../src/infra/db/connection";
import { accountModel } from "../../src/infra/db/models/account-model-db";
import request from "supertest";
import app from "../../src/main/config/app";
import { createDTO } from "../presentation/account/mocks/create-dto";
describe("Account routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
  });
  afterEach(async () => {
    await accountModel.deleteMany();
  });

  describe("signup", () => {
    const validCreateDTO = { ...createDTO, password: "Valid123456" };
    test("should return 400 if invalid body is provided", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, password: "invalid" })
        .expect(400);
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, email: "invalid.com" })
        .expect(400);
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, name: "ab" })
        .expect(400);
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, name: "name_bigger_than_12_characters" })
        .expect(400);
    });
    test("should return 409 if email is already in use", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, password: "validPassword12" })
        .expect(204);
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, password: "validPassword12" })
        .expect(409);
    });
  });
});
