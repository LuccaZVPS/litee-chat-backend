export interface DeleteChangeRequestRepository {
  delete(id: string): Promise<void>;
}
