export type ApiError = {
  message: string;
  param?: string;
  statusCode: number;
};

export type ApiSuccessReponse<T = any> = {
  error: null;
  data: T;
};

export type ApiResponse<T = any> =
  | ApiSuccessReponse<T>
  | {
      error: ApiError;
    };
