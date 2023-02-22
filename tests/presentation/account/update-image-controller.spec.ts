import {
  unlinkFile,
  UpdateImageController,
} from "../../../src/presentation/controllers/account/update-image-controller";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import {
  badRequest,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import { FileType } from "../../../src/presentation/protocols/file-type";

describe("Update image controller", () => {
  const makeFileTypeStub = () => {
    class FileTypeStub implements FileType {
      async type(): Promise<string> {
        return "img";
      }
    }
    return new FileTypeStub();
  };
  const makeSut = () => {
    const fileTypeStub = makeFileTypeStub();
    return {
      fileTypeStub,
      sut: new UpdateImageController(fileTypeStub),
    };
  };
  test("should call file type method with correct value", async () => {
    const { sut, fileTypeStub } = makeSut();
    const spy = jest.spyOn(fileTypeStub, "type");
    await sut.handle({ file: { path: "any_file_path" } });
    expect(spy).toBeCalledWith("any_file_path");
  });
  test("should return server error if file type method throws", async () => {
    const { sut, fileTypeStub } = makeSut();
    jest.spyOn(fileTypeStub, "type").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ file: { path: "any_file_path" } });
    expect(response).toEqual(serverError());
  });
  test("should return bad request if file extension is not allowed", async () => {
    const { sut, fileTypeStub } = makeSut();
    jest.spyOn(fileTypeStub, "type").mockImplementationOnce(async () => {
      return "pdf";
    });
    jest.spyOn(unlinkFile, "unlink").mockImplementationOnce(() => {
      return;
    });

    const response = await sut.handle({ file: { path: "any_file_path" } });
    expect(response).toEqual(
      badRequest(new InvalidBody("file extension not allowed"))
    );
  });
  test("should call unlinkSync with correct path if file extension is not allowed", async () => {
    const { sut, fileTypeStub } = makeSut();
    jest.spyOn(fileTypeStub, "type").mockImplementationOnce(async () => {
      return "pdf";
    });
    const spy = jest.spyOn(unlinkFile, "unlink");
    await sut.handle({ file: { path: "./any_file_path" } });
    expect(spy).toBeCalledWith("./any_file_path");
  });
});
