import { ActionTypes } from "../types";
import { ApiError } from "../../api/user";

export const userLogin = (username: string, password: string) => ({
  type: ActionTypes.USER_LOGIN,
  payload: { username, password },
});

export const userLoginSuccess = (user: {
  username: string;
  avatarUrl: string;
  token: string;
}) => ({
  type: ActionTypes.USER_LOGIN_SUCCESS,
  payload: { user },
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
