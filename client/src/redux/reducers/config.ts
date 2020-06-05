import { Reducer } from "redux";
import { ActionTypes, UserState, ServiceState, ConfigState } from "../types";
import avatarUrl from "../../images/avatar.png";
import { setAction, setError } from "../store";

const defaultState: () => ConfigState = () => ({
  action: null,
  status: "idle",
  error: null,

  accountId: 0,
  configId: 0,
  serviceId: 0,
  token: "",
});

export const configReducer: Reducer<ConfigState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.CONFIG_CREATE_LOADING:
      return { ...state, ...setAction("create") };
    case ActionTypes.CONFIG_CREATE_SUCCESS:
      return { ...state, ...setAction() };
    case ActionTypes.CONFIG_CREATE_ERROR:
      return { ...state, ...setError(action.payload) };

    case ActionTypes.CONFIG_FETCH_LOADING:
      return { ...state, ...setAction("fetch") };
    case ActionTypes.CONFIG_FETCH_SUCCESS:
      return { ...state, ...setAction(), ...action.payload };
    case ActionTypes.CONFIG_FETCH_ERROR:
      return { ...state, ...setError(action.payload) };

    case ActionTypes.CONFIG_DELETE_LOADING:
      return { ...state, ...setAction("delete") };
    case ActionTypes.CONFIG_DELETE_SUCCESS:
      return defaultState();
    case ActionTypes.CONFIG_DELETE_ERROR:
      return { ...state, ...setError(action.payload) };

    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
