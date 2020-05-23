import { ActionTypes } from "../types";

export const addPopup = (name: string) => {
  return { type: ActionTypes.POPUP_PUSH, payload: { hi: "item!" } };
};

export const removePopup = (id: number) => {
  return { type: ActionTypes.POPUP_REMOVE, payload: { hi: true } };
};

export const testHello = (username: string) => {
  return {
    type: ActionTypes.TEST_HELLO,
    payload: { message: `Hello, ${username}!` },
  };
};
