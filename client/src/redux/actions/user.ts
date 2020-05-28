import { ActionTypes } from "../types";

export const userLogin = (name: string) => {
  return {
    type: ActionTypes.USER_LOGIN,
    payload: { username: name, avatarUrl: "" },
  };
};

export const userLogout = () => {
  return { type: ActionTypes.USER_LOGOUT, payload: {} };
};

export const testHello = (username: string) => {
  return {
    type: ActionTypes.TEST_HELLO,
    payload: { message: `Hello, ${username}!` },
  };
};
