import { Reducer } from "redux";
import { ActionTypes, Action, PopupState, TestState } from "../types";

const defaultState: () => TestState = () => ({ message: "" });

export const testReducer: Reducer<TestState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.TEST_HELLO:
      return { ...state, message: action.payload.message };
    default:
      return state;
  }
};
