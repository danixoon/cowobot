import { Reducer } from "redux";
import { ActionTypes, Actions, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => ServiceState = () => ({
  status: "idle",
  error: null,
  data: { selectedServiceConfig: null, services: [] },
});

export const serviceReducer: Reducer<ServiceState, Actions> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.SERVICE_FETCH:
      return { ...state, status: "loading" };
    case ActionTypes.SERVICE_FETCH_SUCCESS:
      return {
        ...state,
        status: "success",
        data: {
          selectedServiceConfig: null,
          services: action.payload.services,
        },
      };
    case ActionTypes.CONFIG_FETCH:
      return { ...state, data: { ...state.data, selectedServiceConfig: null } };
    case ActionTypes.CONFIG_FETCH_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          selectedServiceConfig: {
            ...action.payload,
            variables: action.payload.variables.map((v) => ({
              customKey: v.custom_key,
              defaultKey: v.default_key,
              isTarget: v.isTarget,
            })),
            configId: action.payload.configId,
          },
        },
      };
    default:
      return state;
  }
};
