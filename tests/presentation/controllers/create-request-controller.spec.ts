import { AccountModel } from "../../../src/domain/models/account";
import { FindAccountByEmail } from "../../../src/domain/useCases/account/find-account-by-email";
import { CreateRequestController } from "../../../src/presentation/controllers/request/create-request-controller";
import {
  errorType,
  Validator,
} from "../../../src/presentation/protocols/validator";
import { faker } from "@faker-js/faker";
describe("CreateRequestController", () => {
  const makeFinByEmailStub = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(): Promise<AccountModel | void> {
        return;
      }
    }
    return new FindByEmailStub();
  };
  const makeValidatorStub = () => {
    class ValidatorStub implements Validator {
      async validate(): Promise<{ errors: errorType[] }> {
        return { errors: [] };
      }
    }
    return new ValidatorStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    const finByEmailStub = makeFinByEmailStub();
    return {
      validatorStub,
      finByEmailStub,
      sut: new CreateRequestController(validatorStub, finByEmailStub),
    };
  };
  const createRequestDTO = {
    body: {
      email: faker.internet.email(),
    },
  };
  test("should call validator with correct value", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    await sut.handle(createRequestDTO);
    expect(spy).toHaveBeenCalledWith({ ...createRequestDTO.body });
  });
});
