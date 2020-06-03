import { Reducer } from "redux";
import { ActionTypes, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => ServiceState = () => ({
  serviceId: null,
  serviceView: "configuration",
  services: {
    status: "idle",
    error: null,
    data: [],
  },
  config: {
    data: null,
    status: "idle",
    error: null,
  },
});

export const serviceReducer: Reducer<ServiceState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.SERVICE_SELECT:
      return { ...state, serviceView: action.payload.serviceView };
    case ActionTypes.SERVICE_FETCH:
      return { ...state, services: { ...state.services, status: "loading" } };
    case ActionTypes.SERVICE_FETCH_SUCCESS:
      return {
        ...state,
        services: {
          ...state.services,
          status: "success",
          data: action.payload.services,
        },
      };
    case ActionTypes.CONFIG_FETCH:
      return {
        ...state,
        config: { data: null, error: null, status: "loading" },
      };
    case ActionTypes.CONFIG_FETCH_SUCCESS:
      return {
        ...state,
        serviceId: action.payload?.serviceId ?? null,
        config: {
          ...state.config,
          status: "success",
          data: action.payload.config !== null ? action.payload.config : null,
        },
      };
    case ActionTypes.CONFIG_DELETE_SUCCESS:
      return {
        ...state,
        config: { status: "success", error: null, data: null },
      };

    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
