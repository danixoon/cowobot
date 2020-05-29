import { Reducer } from "redux";
import { ActionTypes, Actions, UserState, ServiceState } from "../types";
import avatarUrl from "../../images/avatar.png";

const defaultState: () => ServiceState = () => ({
  status: "idle",
  error: null,
  data: { selectedService: null, services: [] },
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
          selectedService: null,
          services: action.payload.services,
        },
      };
    default:
      return state;
  }
};
