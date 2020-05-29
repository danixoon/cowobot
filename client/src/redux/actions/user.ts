import { ActionTypes } from "../types";
import { ApiError } from "../../api";

export const userLogin = (username: string, password: string) => ({
  type: ActionTypes.USER_LOGIN,
  payload: { username, password },
});

export const userLoginSuccess = (data: {
  token: string;
  username: string;
}) => ({
  type: ActionTypes.USER_LOGIN_SUCCESS,
  payload: { ...data },
});

export const userLoginError = (error: ApiError) => ({
  type: ActionTypes.USER_LOGIN_ERROR,
  payload: error,
});

export const userLogout = () => {
  return { type: ActionTypes.USER_LOGOUT, payload: {} };
};

export const testHello = (username: string) => {
  return {
    type: ActionTypes.TEST_HELLO,
    payload: { message: `Hello, ${username}!` },
  };
};
