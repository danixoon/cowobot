import { ActionTypes, ServiceState } from "../types";

export const serviceSelect = (serviceId: number) => ({
  type: ActionTypes.SERVICE_SELECT,
  payload: { serviceId },
});

export const serviceFetch = () => ({
  type: ActionTypes.SERVICE_FETCH,
  payload: {},
});

export const serviceFetchSuccess = (data: {
  services: ApiResponseData.Service.Service[];
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

export const configFetch = (configId: number, serviceId: number) => ({
  type: ActionTypes.CONFIG_FETCH,
  payload: { configId, serviceId },
});

export const configFetchSuccess = (data: {
  serviceId: number;
  config: null | {
    variables: ApiResponseData.Service.Variable[];
    notices: ApiResponseData.Service.Notice[];
    actions: ApiResponseData.Service.Action[];
    configId: number;
  };
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

export const configCreateSuccess = (data: ApiMap.POST["/service/config"]) => ({
  type: ActionTypes.CONFIG_CREATE_SUCCESS,
  payload: data,
});

export const configCreateError = (error: ApiError) => ({
  type: ActionTypes.CONFIG_CREATE_ERROR,
  payload: error,
});

export const configDelete = (configId: number) => ({
  type: ActionTypes.CONFIG_DELETE,
  payload: { configId },
});

export const configDeleteSuccess = (
  data: ApiMap.DELETE["/service/config"]
) => ({
  type: ActionTypes.CONFIG_DELETE_SUCCESS,
  payload: data,
});

export const configDeleteError = (error: ApiError) => ({
  type: ActionTypes.CONFIG_DELETE_ERROR,
  payload: error,
});

export const configSave = (data: ApiRequestData.PUT["/service/config"]) => ({
  type: ActionTypes.CONFIG_SAVE,
  payload: data,
});

export const configSaveSuccess = () => ({
  type: ActionTypes.CONFIG_SAVE_SUCCESS,
  payload: {},
});

export const configSaveError = (error: ApiError) => ({
  type: ActionTypes.CONFIG_SAVE_ERROR,
  payload: error,
});
