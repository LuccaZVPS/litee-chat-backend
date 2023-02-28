import { faker } from "@faker-js/faker";
export const createDTO = {
  email: faker.internet.email(),
  name: faker.name.firstName(),
  password: faker.internet.password(),
};
