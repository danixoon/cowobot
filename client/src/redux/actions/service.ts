import { ActionTypes, ServiceState } from "../types";
import { ApiError } from "../../api";

export const serviceSelect = (serviceId: string) => ({
  type: ActionTypes.SERVICE_SELECT,
  payload: { serviceId },
});

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

export const serviceConfigsFetch = (serviceId: string) => ({
  type: ActionTypes.SERVICE_CONFIGS_FETCH,
  payload: { serviceId },
});

export const serviceConfigsFetchSuccess = (data: { id: string }[]) => ({
  type: ActionTypes.SERVICE_CONFIGS_FETCH_SUCCESS,
  payload: data,
});

export const serviceConfigsFetchError = (error: ApiError) => ({
  type: ActionTypes.SERVICE_CONFIGS_FETCH_ERROR,
  payload: error,
});

// Configs

export const serviceConfigFetch = (configId: string) => ({
  type: ActionTypes.SERVICE_CONFIG_FETCH,
  payload: { configId },
});

export const serviceConfigFetchSuccess = (data: {
  variables: { custom_key: string | null; default_key: string; type: string }[];
  actions: { id: number; name: string }[];
  configId: string;
}) => ({
  type: ActionTypes.SERVICE_CONFIG_FETCH_SUCCESS,
  payload: data,
});

export const serviceConfigFetchError = (error: ApiError) => ({
  type: ActionTypes.SERVICE_CONFIG_FETCH_ERROR,
  payload: error,
});
