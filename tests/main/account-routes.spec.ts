import { mongoHelper } from "../../src/infra/db/connection";
import { accountModel } from "../../src/infra/db/models/account-model-db";
import request from "supertest";
import app from "../../src/main/config/app";
import { createDTO } from "../presentation/account/mocks/create-dto";
import { faker } from "@faker-js/faker";
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
    test("should return 204 if valid body is provided", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({ ...validCreateDTO, password: "validPassword12" })
        .expect(204);
    });
  });
  describe("login", () => {
    test("should return 400 if invalid body is provided", async () => {
      await request(app)
        .post("/api/account/login")
        .send({ email: "invalid_email.com", password: "validPassword123" })
        .expect(400);
      await request(app)
        .post("/api/account/login")
        .send({ email: faker.internet.email(), password: "invalid" })
        .expect(400);
    });
    test("should return 401 if the account provided not exist", async () => {
      await request(app)
        .post("/api/account/login")
        .send({ email: faker.internet.email(), password: "validPassword123" })
        .expect(401);
    });
    test("should return 401 if the account provided is not verified", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({
          name: "lucca",
          email: "any@gmail.com",
          password: "validPassword123",
        })
        .expect(204);
      await request(app)
        .post("/api/account/login")
        .send({
          email: "any@gmail.com",
          password: "validPassword123",
        })
        .expect(401);
    });
    test("should return 200 if the account exist and if verified", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({
          name: "lucca",
          email: "any@gmail.com",
          password: "validPassword123",
        })
        .expect(204);
      const acountToVerify = await accountModel.find();
      acountToVerify[0].verified = true;
      acountToVerify[0].save();
      await request(app)
        .post("/api/account/login")
        .send({
          email: "any@gmail.com",
          password: "validPassword123",
        })
        .expect(200);
    });
  });
});
