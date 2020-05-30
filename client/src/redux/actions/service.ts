import { ActionTypes, ServiceState } from "../types";
import { ApiError } from "../../api";

export const serviceSelect = (serviceId: number) => ({
  type: ActionTypes.SERVICE_SELECT,
  payload: { serviceId },
});

export const serviceFetch = () => ({
  type: ActionTypes.SERVICE_FETCH,
  payload: {},
});

export const serviceFetchSuccess = (data: {
  services: { name: string; id: number }[];
}) => ({
  type: ActionTypes.SERVICE_FETCH_SUCCESS,
  payload: data,
});

export const serviceFetchError = (error: ApiError) => ({
  type: ActionTypes.SERVICE_FETCH_ERROR,
  payload: error,
});

// export const configIdsFetch = (serviceId: number) => ({
//   type: ActionTypes.CONFIG_IDS_FETCH,
//   payload: { serviceId },
// });

// export const configIdsFetchSuccess = (data: { id: number }[]) => ({
//   type: ActionTypes.CONFIG_IDS_FETCH_SUCCESS,
//   payload: data,
// });

// export const configIdsFetchError = (error: ApiError) => ({
//   type: ActionTypes.CONFIG_IDS_FETCH_ERROR,
//   payload: error,
// });

// Configs

export const configFetch = (configId: number) => ({
  type: ActionTypes.CONFIG_FETCH,
  payload: { configId },
});

export const configFetchSuccess = (data: {
  variables: {
    custom_key: string | null;
    default_key: string;
    type: string;
    isTarget: boolean;
  }[];
  actions: { id: number; name: string }[];
  configId: number;
  serviceId: number;
}) => ({
  type: ActionTypes.CONFIG_FETCH_SUCCESS,
  payload: data,
});

export const configFetchError = (error: ApiError) => ({
  type: ActionTypes.CONFIG_FETCH_ERROR,
  payload: error,
});

// создание конфигураций для сервиса

export const configCreate = (serviceId: number) => ({
  type: ActionTypes.CONFIG_CREATE,
  payload: { serviceId },
});

export const configCreateSuccess = (data: { configId: number }) => ({
  type: ActionTypes.CONFIG_CREATE_SUCCESS,
  payload: data,
});

export const configCreateError = (error: ApiError) => ({
  type: ActionTypes.CONFIG_CREATE_ERROR,
  payload: error,
});
