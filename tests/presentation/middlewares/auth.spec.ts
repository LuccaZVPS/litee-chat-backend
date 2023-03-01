import { UnauthorizedError } from "../../../src/presentation/errors/unauthorized-error";
import {
  ok,
  unauthorized,
} from "../../../src/presentation/helpers/http-helper";
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware";

describe("Auth middleware", () => {
  const makeSut = () => {
    return {
      sut: new AuthMiddleware(),
    };
  };
  test("should return 401 if account is not saved in session", async () => {
    const { sut } = makeSut();
    const response = await sut.run({
      headers: {},
      session: {},
    });
    expect(response).toEqual(unauthorized(new UnauthorizedError()));
  });
  test("should return 200 if account is saved in session", async () => {
    const { sut } = makeSut();
    const response = await sut.run({
      headers: {},
      session: { account: { _id: "any_id" } },
    });

    expect(response).toEqual(ok(""));
  });
});
