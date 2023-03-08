import { AccountModel } from "../../../../src/domain/models/account";
import { FindAccountByEmail } from "../../../../src/domain/useCases/account/find-account-by-email";
import { CreateRequestController } from "../../../../src/presentation/controllers/request/create-request-controller";
import {
  errorType,
  Validator,
} from "../../../../src/presentation/protocols/validator";
import { faker } from "@faker-js/faker";
import {
  badRequest,
  conflict,
  notFound,
  serverError,
} from "../../../../src/presentation/helpers/http-helper";
import { InvalidBody } from "../../../../src/presentation/errors/invalid-body-error";
import { anyAccount } from "../account/mocks/fake-account";
import { CreateRequest } from "../../../../src/domain/useCases/request/create-request";
describe("CreateRequestController", () => {
  const fakeAccount = anyAccount;
  const makeFinByEmailStub = () => {
    class FindByEmailStub implements FindAccountByEmail {
      async findByEmail(): Promise<AccountModel | void> {
        return fakeAccount;
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
  const makeCreateRequest = () => {
    class CreateRequestStub implements CreateRequest {
      async create(): Promise<boolean> {
        return true;
      }
    }
    return new CreateRequestStub();
  };
  const makeSut = () => {
    const validatorStub = makeValidatorStub();
    const finByEmailStub = makeFinByEmailStub();
    const createRequestStub = makeCreateRequest();
    return {
      validatorStub,
      finByEmailStub,
      createRequestStub,
      sut: new CreateRequestController(
        validatorStub,
        finByEmailStub,
        createRequestStub
      ),
    };
  };
  const createRequestDTO = {
    body: {
      email: faker.internet.email(),
      account: {
        _id: "any_id",
      },
    },
  };
  test("should call validator with correct value", async () => {
    const { sut, validatorStub } = makeSut();
    const spy = jest.spyOn(validatorStub, "validate");
    await sut.handle(createRequestDTO);
    expect(spy).toHaveBeenCalledWith({ email: createRequestDTO.body.email });
  });
  test("should return badRequest if validate return errors", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(async () => {
      return { errors: [{ errors: ["any"], field: "any" }] };
    });
    const reponse = await sut.handle(createRequestDTO);
    expect(reponse).toEqual(
      badRequest(new InvalidBody([{ errors: ["any"], field: "any" }]))
    );
  });
  test("should return serverError if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    const reponse = await sut.handle(createRequestDTO);
    expect(reponse).toEqual(serverError());
  });
  test("should call findByEmail with correct value", async () => {
    const { sut, finByEmailStub } = makeSut();
    const spy = jest.spyOn(finByEmailStub, "findByEmail");
    await sut.handle(createRequestDTO);
    expect(spy).toHaveBeenCalledWith(createRequestDTO.body.email);
  });
  test("should return notFound if findByEmail returns void", async () => {
    const { sut, finByEmailStub } = makeSut();
    jest
      .spyOn(finByEmailStub, "findByEmail")
      .mockImplementationOnce(async () => {
        return;
      });
    const response = await sut.handle(createRequestDTO);
    expect(response).toEqual(notFound("account not found"));
  });
  test("should return server error if findByEmail throws", async () => {
    const { sut, finByEmailStub } = makeSut();
    jest
      .spyOn(finByEmailStub, "findByEmail")
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(createRequestDTO);
    expect(response).toEqual(serverError());
  });
  test("should call createRequest with correct values", async () => {
    const { sut, createRequestStub } = makeSut();
    const spy = jest.spyOn(createRequestStub, "create");
    await sut.handle(createRequestDTO);
    expect(spy).toHaveBeenCalledWith({
      from: undefined,
      to: {
        _id: fakeAccount._id,
        friendList: [],
        requests: [],
      },
    });
  });
  test("should return conflict if createRequest returns false", async () => {
    const { sut, createRequestStub } = makeSut();
    jest.spyOn(createRequestStub, "create").mockImplementationOnce(async () => {
      return false;
    });
    const reponse = await sut.handle(createRequestDTO);
    expect(reponse).toEqual(conflict("request already sent"));
  });
});
