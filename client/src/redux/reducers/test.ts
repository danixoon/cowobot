import { Reducer } from "redux";
import { ActionTypes, Actions, UserState, TestState } from "../types";

const defaultState: () => TestState = () => ({ message: "" });

export const testReducer: Reducer<TestState, Actions> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};
