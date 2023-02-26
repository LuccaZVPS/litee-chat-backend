import { FileTypeAdapter } from "../../../../infra/utils/file-type-adapter";
import { FileValidator } from "../../../../validation/file-validator";
import { makeUpdateImageFactory } from "../../useCases/account/update-image-factory";
import { UpdateImageController } from "../../../../presentation/controllers/account/update-image-controller";
export const makeUpdateImageController = () => {
  const fileType = new FileTypeAdapter();
  const fileValidator = new FileValidator(fileType);
  const updateImage = makeUpdateImageFactory();
  return new UpdateImageController(fileValidator, updateImage);
};
