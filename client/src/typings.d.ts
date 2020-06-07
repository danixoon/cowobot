declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare type WithRandomId = {
  randomId?: string;
};

declare type INoticeWithData = WithRandomId &
  INotice & {
    values: INoticeValue[];
    queries: INoticeQuery[];
    targetKey: string | null;
  };

declare type IServiceWithAction = IService & { actions: IAction[] };

declare type ISavedNotice = {
  messageTemplate: string;
  values: { key: string; value: string }[];
  queries: { key: string; customKey: string }[];
  targetKey: null | string;
  actionId?: number;
};

declare type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType[number];

declare type ActionPayload = {
  USER_LOGIN: { username: string; password: string };
  USER_LOGIN_LOADING: {};
  USER_LOGIN_SUCCESS: { token: string };
  USER_LOGIN_ERROR: ApiError;

  USER_FETCH: {};
  USER_FETCH_LOADING: {};
  USER_FETCH_SUCCESS: {
    id: number;
    username: string;
    nickname: string;
    serviceId: number;
  };
  USER_FETCH_ERROR: ApiError;

  USER_LOGOUT: {};
  USER_LOGOUT_SUCCESS: {};

  SERVICES_FETCH: {};
  SERVICES_FETCH_LOADING: {};
  SERVICES_FETCH_SUCCESS: IServiceWithAction[];
  SERVICES_FETCH_ERROR: ApiError;

  SERVICE_SELECT: { serviceId: number };
  SERVICE_VIEW_SELECT: { serviceView: ServiceConfigView };

  SERVICE_CONFIG_FETCH: { serviceId: number };
  SERVICE_CONFIG_FETCH_LOADING: {};
  SERVICE_CONFIG_FETCH_SUCCESS: { id: number };
  SERVICE_CONFIG_FETCH_ERROR: ApiError;

  CONFIG_FETCH: { configId: number };
  CONFIG_FETCH_LOADING: {};
  CONFIG_FETCH_SUCCESS: IConfig | null;
  CONFIG_FETCH_ERROR: ApiError;

  CONFIG_UPDATE: { configId: number; token: string };
  CONFIG_UPDATE_LOADING: {};
  CONFIG_UPDATE_SUCCESS: { id: number };
  CONFIG_UPDATE_ERROR: ApiError;

  CONFIG_CREATE: { serviceId: number };
  CONFIG_CREATE_LOADING: {};
  CONFIG_CREATE_SUCCESS: { id: number };
  CONFIG_CREATE_ERROR: ApiError;

  CONFIG_DELETE: { configId: number };
  CONFIG_DELETE_LOADING: {};
  CONFIG_DELETE_SUCCESS: { id: number };
  CONFIG_DELETE_ERROR: ApiError;

  NOTICES_FETCH: { configId: number };
  NOTICES_FETCH_LOADING: {};
  NOTICES_FETCH_SUCCESS: INotice[];
  NOTICES_FETCH_ERROR: ApiError;

  NOTICE_FETCH: WithRandomId & { noticeId: number };
  NOTICE_FETCH_LOADING: { noticeId: number };
  NOTICE_FETCH_SUCCESS: WithRandomId & INoticeWithData;
  NOTICE_FETCH_ERROR: ApiError;

  NOTICE_DELETE: { noticeId: number };
  NOTICE_DELETE_LOADING: { noticeId: number };
  NOTICE_DELETE_SUCCESS: { id: number };
  NOTICE_DELETE_ERROR: ApiError;

  NOTICE_ADD: INoticeWithData;
  NOTICE_ADD_LOADING: { randomId?: string };
  NOTICE_ADD_SUCCESS: { id: number; randomId?: string };
  NOTICE_ADD_ERROR: ApiError;

  NOTICE_SAVE: WithRandomId & Partial<ISavedNotice> & { noticeId: number };
  NOTICE_SAVE_LOADING: WithRandomId & {};
  NOTICE_SAVE_SUCCESS: INoticeWithData;
  NOTICE_SAVE_ERROR: ApiError;

  // // Получение известных сервисов
  // SERVICE_FETCH: {};
  // SERVICE_FETCH_SUCCESS: {
  //   services: ApiResponseData.Service.Service[];
  // };
  // SERVICE_FETCH_ERROR: { error: ApiError };
  // // Выбор сервиса на дереве
  // SERVICE_SELECT: {
  //   serviceId: number;
  //   serviceView: ServiceConfigView;
  // };
  // // Получение конфигурации по идентификатору
  // CONFIG_FETCH: {
  //   configId: number;
  //   serviceId: number;
  // };
  //SERVICE_CONFIG_FETCH_SUCCESS: {
  //   serviceId: number;
  //   config: null | {
  //     token: string;
  //     variables: ApiResponseData.Service.Variable[];
  //     notices: ApiResponseData.Service.Notice[];
  //     actions: ApiResponseData.Service.Action[];
  //     configId: number;
  //   };
  // };
  //SERVICE_CONFIG_FETCH_ERROR: { error: ApiError };
  // // Создание конфигурации для сервиса
  // CONFIG_CREATE: { serviceId: number };
  // CONFIG_CREATE_SUCCESS: ApiMap.POST["/service/config"];
  // CONFIG_CREATE_ERROR: { error: ApiError };
  // // Удаление конфигурации из сервиса
  // CONFIG_DELETE: { configId: number };
  // CONFIG_DELETE_SUCCESS: ApiMap.DELETE["/service/config"];
  // CONFIG_DELETE_ERROR: { error: ApiError };
  // // Сохранение конфигурации
  // CONFIG_SAVE: ApiRequestData.PUT["/service/config"];
  // CONFIG_SAVE_SUCCESS: {};
  // CONFIG_SAVE_ERROR: { error: ApiError };
  // CONFIG_TOKEN_CHANGE: { token: string };
  // // // Получение идентификаторов известных конфигураций
  // // CONFIG_IDS_FETCH: "CONF,
  // // CONFIG_IDS_FETCH_SUCCESS: "CONFIG_IDS_F,
  // // CONFIG_IDS_FETCH_ERROR: "CONFIG_IDS,
  // TEST_HELLO: {};
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

declare type StateSchema<T, A extends string = null> = {
  action: A | null;
  error: ApiError | null;
} & T;

declare type DataStatus = "idle" | "loading" | "success" | "error";
declare type ServiceConfigView = "control" | "config";
