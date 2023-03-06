import { UpdateImage as UpdateImageType } from "../../../domain/useCases/account/update-image";
import { UpdateImageRepository } from "../../protocols/account-repository/update-image-repository";

export class UpdateImage implements UpdateImageType {
  constructor(private readonly updateImageRepository: UpdateImageRepository) {}
  async update(_id: string, path: string): Promise<void> {
    await this.updateImageRepository.update(_id, path);
    return;
  }
}
