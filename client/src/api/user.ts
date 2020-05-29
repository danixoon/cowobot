import axios, { AxiosResponse } from "axios";

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

export const userLogin = async (username: string, password: string) => {
  return (await axios.get("/api/auth", { params: { username, password } }))
    .data;
};
