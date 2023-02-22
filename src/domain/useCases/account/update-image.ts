export interface UpdateImage {
  update(_id: string, path: string): Promise<void>;
}
