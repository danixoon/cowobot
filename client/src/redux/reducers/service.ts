import { Reducer } from "redux";
import { ActionTypes, Actions, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => ServiceState = () => ({
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
    case ActionTypes.CONFIG_FETCH_SUCCESS:
      return {
        ...state,
        config: {
          ...state.config,
          data:
            action.payload !== null
              ? {
                  ...action.payload,
                  variables: action.payload.variables.map((v) => ({
                    customKey: v.custom_key,
                    defaultKey: v.default_key,
                    isTarget: v.isTarget,
                  })),
                  configId: action.payload.configId,
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
