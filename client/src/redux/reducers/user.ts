import { Reducer } from "redux";
import { ActionTypes, Action, UserState } from "../types";

const defaultState: () => UserState = () => ({ username: "", avatarUrl: "" });

export const userReducer: Reducer<UserState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};
