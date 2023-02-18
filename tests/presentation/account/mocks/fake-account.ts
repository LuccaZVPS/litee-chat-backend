import { AccountModel } from "../../../../src/domain/models/account";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
export const anyAccount: AccountModel = {
  _id: randomUUID(),
  email: faker.internet.email(),
  friends: [],
  imageURL: faker.internet.url(),
  name: faker.internet.userName(),
  password: faker.internet.password(),
  requests: [],
};
