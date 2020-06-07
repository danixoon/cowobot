import { Reducer } from "redux";
import { ActionTypes, UserState, TestState } from "../types";

const defaultState: () => TestState = () => ({ message: "" });

export const testReducer: Reducer<TestState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    default:
      return state;
  }
};
