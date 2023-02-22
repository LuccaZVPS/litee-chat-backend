export interface FindSecret {
  find(_id: string): Promise<string | void>;
}
