export interface FindSecretRepository {
  find(_id: string): Promise<string | void>;
}
