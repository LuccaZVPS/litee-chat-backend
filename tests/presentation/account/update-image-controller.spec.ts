import { UpdateImage } from "../../../src/domain/useCases/account/update-image";
import { UpdateImageController } from "../../../src/presentation/controllers/account/update-image-controller";
import { InvalidBody } from "../../../src/presentation/errors/invalid-body-error";
import crypto from "crypto";
import {
  badRequest,
  ok,
  serverError,
} from "../../../src/presentation/helpers/http-helper";
import {
  checkFileReturnType,
  FileType,
} from "../../../src/presentation/protocols/file-type";

describe("Update image controller", () => {
  const makeUpdateImageStub = () => {
    class UpdateImageStub implements UpdateImage {
      async update(): Promise<void> {
        return;
      }
    }
    return new UpdateImageStub();
  };
  const makeFileTypeStub = () => {
    class FileTypeStub implements FileType {
      async checkFile(): Promise<checkFileReturnType> {
        return {
          isValid: true,
          extension: "png",
        };
      }
    }
    return new FileTypeStub();
  };
  const makeSut = () => {
    const fileTypeStub = makeFileTypeStub();
    const updateImageStub = makeUpdateImageStub();
    return {
      fileTypeStub,
      updateImageStub,
      sut: new UpdateImageController(fileTypeStub, updateImageStub),
    };
  };
  test("should call file type method with correct value", async () => {
    const { sut, fileTypeStub } = makeSut();
    const spy = jest.spyOn(fileTypeStub, "checkFile");
    await sut.handle({ file: { tempFilePath: "any_file_path" } });
    expect(spy).toBeCalledWith("any_file_path");
  });
  test("should return server error if file type method throws", async () => {
    const { sut, fileTypeStub } = makeSut();
    jest.spyOn(fileTypeStub, "checkFile").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle({ file: { path: "any_file_path" } });
    expect(response).toEqual(serverError());
  });
  test("should return bad request if file extension is not allowed", async () => {
    const { sut, fileTypeStub } = makeSut();
    jest.spyOn(fileTypeStub, "checkFile").mockImplementationOnce(async () => {
      return { extension: "", isValid: false };
    });
    const response = await sut.handle({ file: { path: "any_file_path" } });
    expect(response).toEqual(
      badRequest(new InvalidBody("file extension not allowed"))
    );
  });
  test("should call uuid", async () => {
    const { sut } = makeSut();
    const spy = jest.spyOn(crypto, "randomUUID");
    await sut.handle({ file: { path: "any_file_path" } });
    expect(spy).toHaveBeenCalled();
  });
  test("should call update method with correct values", async () => {
    const { sut, updateImageStub } = makeSut();
    const spy = jest.spyOn(updateImageStub, "update");
    jest.spyOn(crypto, "randomUUID").mockImplementationOnce(() => "any_uuid");
    await sut.handle({ file: { path: "any_file_path" }, userId: "any_id" });
    expect(spy).toBeCalledWith("any_id", process.cwd() + "/" + "any_uuid.png");
  });
  test("should thorws if update method throws", async () => {
    const { sut, updateImageStub } = makeSut();
    jest.spyOn(updateImageStub, "update").mockImplementationOnce(async () => {
      throw new Error();
    });
    const response = await sut.handle({
      file: { path: "any_file_path" },
      userId: "any_id",
    });
    expect(response).toEqual(serverError());
  });
  test("should return ok", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({
      file: { path: "any_file_path" },
      userId: "any_id",
    });
    expect(response).toEqual(ok("image updated"));
  });
});
