import { ActionTypes } from "../types";

export const testHello = (username: string) => {
  return {
    type: ActionTypes.TEST_HELLO,
    payload: { message: `Hello, ${username}!` },
  };
};
