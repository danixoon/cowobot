import axios, { AxiosResponse } from "axios";

export type ApiError = {
  message: string;
  statusCode: number;
};

export type ApiResponse<T = any> =
  | {
      error: null;
      data: T;
    }
  | {
      error: ApiError;
    };

export const loginUser = async (username: string, password: string) => {
  return (await axios.get("/api/auth", { params: { username, password } }))
    .data;
};
