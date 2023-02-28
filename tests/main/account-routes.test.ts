import { mongoHelper } from "../../src/infra/db/connection";
import { accountModel } from "../../src/infra/db/models/account-model-db";
import request from "supertest";
import app from "../../src/main/config/app";
import { createDTO } from "../presentation/controllers/account/mocks/create-dto";
import { faker } from "@faker-js/faker";
import path from "path";
import { randomSecret } from "./mocks/random-secret";
import { emailVerifyModel } from "../../src/infra/db/models/email-verify-model-db";
describe("Account routes", () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await mongoHelper.close();
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
          email: "any2@gmail.com",
          password: "validPassword123",
        })
        .expect(204);

      const acountToVerify = await accountModel.findOne({
        email: "any2@gmail.com",
      });
      acountToVerify.verified = true;
      acountToVerify.save();
      await request(app)
        .post("/api/account/login")
        .send({
          email: "any2@gmail.com",
          password: "validPassword123",
        })
        .expect(200);
    });
  });
  describe("image", () => {
    test("should return 400 if invalid file is provided", async () => {
      await request(app)
        .put("/api/account/image")
        .attach("file", path.resolve(__dirname, "./mocks/invalid.png"))
        .expect(400);
    });
    test("should return 200 if valid file is provided", async () => {
      await request(app)
        .put("/api/account/image")
        .attach("file", path.resolve(__dirname, "./mocks/valid.png"))
        .expect(200);
    });
  });
  describe("verify", () => {
    test("should return 400 if invalid secret or id is provided", async () => {
      await request(app)
        .put("/api/account/verify/any_id/invalid_secret")
        .expect(400);
    });
    test("should return 403 if secret or id do not exist in database", async () => {
      await request(app)
        .put("/api/account/verify/any_id/" + randomSecret)
        .expect(403);
    });
    test("should return 200 and verify an account", async () => {
      await request(app)
        .post("/api/account/signup")
        .send({
          email: "lucca@gmail.com",
          name: "lucca",
          password: "validPassword12",
        })
        .expect(204);
      const accounToVerify = await accountModel.findOne({
        email: "lucca@gmail.com",
      });
      const verifyData = await emailVerifyModel.findOne({
        accountId: accounToVerify._id,
      });
      await request(app)
        .put(
          "/api/account/verify/" + accounToVerify._id + "/" + verifyData.secret
        )
        .expect(200);
    });
  });
});
