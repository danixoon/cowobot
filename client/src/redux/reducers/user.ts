import { Reducer } from "redux";
import { ActionTypes, UserState } from "../types";
import avatarUrl from "../../images/avatar.png";
import { setError, setAction } from "../store";

const defaultState: () => UserState = () => ({
  action: null,
  error: null,
  isAuth: false,
  username: "",
});

export const userReducer: Reducer<UserState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.USER_FETCH_LOADING:
      return { ...state, ...setAction("fetch") };
    case ActionTypes.USER_FETCH_SUCCESS:
      return { ...state, ...setAction(), ...action.payload };
    case ActionTypes.USER_FETCH_ERROR:
      return { ...state, ...setError(action.payload) };

    case ActionTypes.USER_LOGIN_ERROR:
      return { ...state, ...setError(action.payload) };
    case ActionTypes.USER_LOGIN_LOADING:
      return { ...state, ...setAction("login") };
    case ActionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        ...setAction(),
        isAuth: true,
      };
    case ActionTypes.USER_LOGOUT:
      return { ...state, ...setAction("logout") };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
