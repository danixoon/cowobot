import { ActionTypes, ServiceState } from "../types";
import { ApiError } from "../../api";

export const serviceFetch = () => ({
  type: ActionTypes.SERVICE_FETCH,
  payload: {},
});

export const serviceFetchSuccess = (data: {
  services: { name: string; id: string }[];
}) => ({
  type: ActionTypes.SERVICE_FETCH_SUCCESS,
  payload: data,
});

export const serviceFetchError = (error: ApiError) => ({
  type: ActionTypes.SERVICE_FETCH_ERROR,
  payload: error,
});
