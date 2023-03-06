import { UpdateImageRepository } from "../../../src/data/protocols/account-repository/update-image-repository";
import { UpdateImage } from "../../../src/data/useCases/account/update-image";

describe("UpdateImage", () => {
  const makeUpdateImageRepositoryStub = () => {
    class UpdateImageRepositoryStub implements UpdateImageRepository {
      async update(): Promise<void> {
        return;
      }
    }
    return new UpdateImageRepositoryStub();
  };
  const makeSut = () => {
    const updateImageRepositoryStub = makeUpdateImageRepositoryStub();
    return {
      updateImageRepositoryStub,
      sut: new UpdateImage(updateImageRepositoryStub),
    };
  };
  test("should call updateImage with correct value", async () => {
    const { sut, updateImageRepositoryStub } = makeSut();
    const spy = jest.spyOn(updateImageRepositoryStub, "update");
    await sut.update("any_id", "any_path");
    expect(spy).toHaveBeenCalledWith("any_id", "any_path");
  });
  test("should throws if update method throws", () => {
    const { sut, updateImageRepositoryStub } = makeSut();
    jest
      .spyOn(updateImageRepositoryStub, "update")
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.update("any_id", "any_path");
    expect(response).rejects.toThrow(new Error());
  });
});
