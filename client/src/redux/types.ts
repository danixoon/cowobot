export const getAction = <A extends keyof ActionPayload>(
  type: A,
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => ({ type, payload });

export const getActionCreator = <A extends keyof ActionPayload>(type: A) => (
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => getAction(type, payload);

export const ActionTypes: { [K in keyof ActionPayload]: K } = {
  USER_LOGIN: "USER_LOGIN" as const,
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR",
  USER_LOGOUT: "USER_LOGOUT",
  USER_LOGOUT_SUCCESS: "USER_LOGOUT_SUCCESS",

  // Получение известных сервисов
  SERVICE_FETCH: "SERVICE_FETCH",
  SERVICE_FETCH_SUCCESS: "SERVICE_FETCH_SUCCESS",
  SERVICE_FETCH_ERROR: "SERVICE_FETCH_ERROR",

  // Выбор сервиса на дереве
  SERVICE_SELECT: "SERVICE_SELECT",

  // Получение конфигурации по идентификатору
  CONFIG_FETCH: "CONFIG_FETCH",
  CONFIG_FETCH_SUCCESS: "CONFIG_FETCH_SUCCESS",
  CONFIG_FETCH_ERROR: "CONFIG_FETCH_ERROR",

  // Создание конфигурации для сервиса
  CONFIG_CREATE: "CONFIG_CREATE",
  CONFIG_CREATE_SUCCESS: "CONFIG_CREATE_SUCCESS",
  CONFIG_CREATE_ERROR: "CONFIG_CREATE_ERROR",

  // Удаление конфигурации из сервиса
  CONFIG_DELETE: "CONFIG_DELETE",
  CONFIG_DELETE_SUCCESS: "CONFIG_DELETE_SUCCESS",
  CONFIG_DELETE_ERROR: "CONFIG_DELETE_ERROR",

  // Сохранение конфигурации

  CONFIG_SAVE: "CONFIG_SAVE",
  CONFIG_SAVE_SUCCESS: "CONFIG_SAVE_SUCCESS",
  CONFIG_SAVE_ERROR: "CONFIG_SAVE_ERROR",

  CONFIG_TOKEN_CHANGE: "CONFIG_TOKEN_CHANGE",

  // // Получение идентификаторов известных конфигураций
  // CONFIG_IDS_FETCH: "CONFIG_IDS_FETCH" ,
  // CONFIG_IDS_FETCH_SUCCESS: "CONFIG_IDS_FETCH_SUCCESS" ,
  // CONFIG_IDS_FETCH_ERROR: "CONFIG_IDS_FETCH_ERROR" ,

  TEST_HELLO: "TEST_HELLO",
} as const;

export type UserState = StateSchema<{
  username: string;
  token: string | null;
}>;

export type ServiceState = {
  serviceId: number | null;
  serviceView: ServiceConfigView;
  services: StateSchema<ApiResponseData.Service.Service[]>;
  config: StateSchema<{
    token: string;
    configId: number;
    // Варианты событий (ревью не ревью)
    actions: ApiResponseData.Service.Action[];
    variables: ApiResponseData.Service.Variable[];
    notices: ApiResponseData.Service.Notice[];
  }>;
};

export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
  service: ServiceState;
}
