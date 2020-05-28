import { Reducer } from "redux";
import { ActionTypes, Actions, UserState } from "../types";

const defaultState: () => UserState = () => ({
  username: "",
  avatarUrl: "",
  login: false,
});

export const userReducer: Reducer<UserState, Actions> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};
