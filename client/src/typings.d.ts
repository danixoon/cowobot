declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType[number];

declare type ActionPayload = {
  USER_LOGIN: { username: string; password: string };
  USER_LOGIN_SUCCESS: { token: string; username: string };
  USER_LOGIN_ERROR: { error: ApiError };
  USER_LOGOUT: {};
  USER_LOGOUT_SUCCESS: {};

  // Получение известных сервисов
  SERVICE_FETCH: {};
  SERVICE_FETCH_SUCCESS: {
    services: ApiResponseData.Service.Service[];
  };
  SERVICE_FETCH_ERROR: { error: ApiError };

  // Выбор сервиса на дереве
  SERVICE_SELECT: {
    serviceId: number;
    serviceView: ServiceConfigView;
  };

  // Получение конфигурации по идентификатору
  CONFIG_FETCH: {
    configId: number;
    serviceId: number;
  };
  CONFIG_FETCH_SUCCESS: {
    serviceId: number;
    config: null | {
      variables: ApiResponseData.Service.Variable[];
      notices: ApiResponseData.Service.Notice[];
      actions: ApiResponseData.Service.Action[];
      configId: number;
    };
  };
  CONFIG_FETCH_ERROR: { error: ApiError };

  // Создание конфигурации для сервиса
  CONFIG_CREATE: { serviceId: number };
  CONFIG_CREATE_SUCCESS: ApiMap.POST["/service/config"];
  CONFIG_CREATE_ERROR: { error: ApiError };

  // Удаление конфигурации из сервиса
  CONFIG_DELETE: { configId: number };
  CONFIG_DELETE_SUCCESS: ApiMap.DELETE["/service/config"];
  CONFIG_DELETE_ERROR: { error: ApiError };

  // Сохранение конфигурации

  CONFIG_SAVE: ApiRequestData.PUT["/service/config"];
  CONFIG_SAVE_SUCCESS: {};
  CONFIG_SAVE_ERROR: { error: ApiError };

  // // Получение идентификаторов известных конфигураций
  // CONFIG_IDS_FETCH: "CONF,
  // CONFIG_IDS_FETCH_SUCCESS: "CONFIG_IDS_F,
  // CONFIG_IDS_FETCH_ERROR: "CONFIG_IDS,

  TEST_HELLO: {};
};

declare type Action<
  A extends keyof ActionPayload = keyof ActionPayload
> = A extends keyof ActionPayload
  ? { type: A; payload: ActionPayload[A] }
  : never;

// type ActionTypes = import("./redux/types").ActionNames;
// type ActionCreators = import("./redux/types").ActionCreators;

// export type ActionType = ActionTypes[keyof ActionTypes];
// export type Actions = ReturnType<ActionCreators[keyof ActionCreators]>;
// export type Action<T extends ActionType> = Extract<Actions, { type: T }>;

declare type StateSchema<T> = {
  status: DataStatus;
  error: ApiError | null;
  data: T | null;
};

declare type DataStatus = "idle" | "loading" | "success" | "error";
declare type ServiceConfigView = "connection" | "configuration";
