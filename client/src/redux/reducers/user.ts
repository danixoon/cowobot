import { Reducer } from "redux";
import { ActionTypes, Actions, UserState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => UserState = () => ({
  data: { avatarUrl, username: "" },
  status: "idle",
  error: null,
});

export const userReducer: Reducer<UserState, Actions> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.USER_LOGIN_ERROR:
      return { ...state, error: action.payload, status: "error" };
    case ActionTypes.USER_LOGIN:
      return { ...state, error: null, status: "loading" };
    case ActionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        status: "success",
        data: { ...state.data, username: action.payload.username },
      };
    default:
      return state;
  }
};
