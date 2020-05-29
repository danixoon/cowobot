import { Reducer } from "redux";
import { ActionTypes, Actions, UserState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => UserState = () => ({
  data: { avatarUrl, username: "", token: null },
  status: window.localStorage.getItem("token") ? "success" : "idle",
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
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    case ActionTypes.USER_LOGOUT:
      return { ...state, ...defaultState() };
    default:
      return state;
  }
};
