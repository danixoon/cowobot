import { Reducer } from "redux";
import { ActionTypes, Actions, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => ServiceState = () => ({
  serviceId: null,
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

export const serviceReducer: Reducer<ServiceState, Actions> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
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
      return { ...state, config: { ...state.config, status: "loading" } };
    case ActionTypes.CONFIG_DELETE_SUCCESS:
      return {
        ...state,
        config: { status: "success", error: null, data: null },
      };
    case ActionTypes.CONFIG_FETCH_SUCCESS:
      return {
        ...state,
        serviceId: action.payload?.serviceId ?? null,
        config: {
          ...state.config,
          status: "success",
          data:
            action.payload.config !== null
              ? {
                  ...action.payload.config,
                  variables: action.payload.config.variables.map((v) => ({
                    id: v.id,
                    name: v.name,
                    customKey: v.custom_key,
                    defaultKey: v.default_key,
                    isTarget: v.isTarget,
                  })),
                  configId: action.payload.config.configId,
                }
              : null,
        },
      };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
