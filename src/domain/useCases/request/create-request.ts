export interface CreateRequest {
  create(params: CreateRequestParams): Promise<boolean>;
}
export interface CreateRequestParams {
  from: string;
  to: {
    _id: string;
    requests: string[];
    friendList: string[];
  };
}
