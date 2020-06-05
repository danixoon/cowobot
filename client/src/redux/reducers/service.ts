import { Reducer } from "redux";
import { ActionTypes, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";
import { setAction, setError } from "../store";

const defaultState: () => ServiceState = () => ({
  action: null,
  error: null,
  serviceId: 0,
  serviceView: "configuration",
  services: [],
});

export const serviceReducer: Reducer<ServiceState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.SERVICE_SELECT:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypes.SERVICES_FETCH_LOADING:
      return { ...state, ...setAction("fetch") };
    case ActionTypes.SERVICES_FETCH_SUCCESS:
      return {
        ...state,
        ...setAction(),
        services: action.payload,
      };
    case ActionTypes.SERVICES_FETCH_ERROR:
      return {
        ...state,
        ...setError(action.payload),
      };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
