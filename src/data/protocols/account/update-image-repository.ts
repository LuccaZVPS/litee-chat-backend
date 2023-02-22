export interface UpdateImageRepository {
  update(_id: string, path: string): Promise<void>;
}
