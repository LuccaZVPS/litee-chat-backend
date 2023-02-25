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
    await sut.type("any_path");
    expect(spy).toHaveBeenCalledWith("any_path");
  });
});
