import { Reducer } from "redux";
import { ActionTypes, UserState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => UserState = () => ({
  status: window.localStorage.getItem("token") ? "success" : "idle",
  error: null,
  data: { token: null, username: "" },
});

export const userReducer: Reducer<UserState, ActionMap.Actions> = (
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
        data: action.payload,
      };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
