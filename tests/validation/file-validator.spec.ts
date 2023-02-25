import { FileValidator } from "../../src/validation/file-validator";
import { FileTypeAdapter } from "../../src/validation/protocols/file-type-adapter";

describe("FileValidator", () => {
  const makeFileTypeAdaptetStub = () => {
    class FileTypeAdapterStub implements FileTypeAdapter {
      async getType(): Promise<string> {
        return "png";
      }
    }
    return new FileTypeAdapterStub();
  };
  const makeSut = () => {
    const fileTypeAdapterStub = makeFileTypeAdaptetStub();
    return {
      fileTypeAdapterStub,
      sut: new FileValidator(fileTypeAdapterStub),
    };
  };
  test("should call getType with correct value", async () => {
    const { sut, fileTypeAdapterStub } = makeSut();
    const spy = jest.spyOn(fileTypeAdapterStub, "getType");
    await sut.checkFile("any_path");
    expect(spy).toHaveBeenCalledWith("any_path");
  });
  test("should throws if getType method throws", async () => {
    const { sut, fileTypeAdapterStub } = makeSut();
    jest.spyOn(fileTypeAdapterStub, "getType").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.checkFile("any_path");
    expect(response).rejects.toThrow(new Error());
  });
});
