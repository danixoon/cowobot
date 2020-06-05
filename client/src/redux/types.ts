export const getAction = <A extends keyof ActionPayload>(
  type: A,
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => ({ type, payload });

export const getActionCreator = <A extends keyof ActionPayload>(type: A) => (
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => getAction(type, payload);

export const ActionTypes: { [K in keyof ActionPayload]: K } = {
  USER_LOGIN: "USER_LOGIN",
  USER_LOGIN_LOADING: "USER_LOGIN_LOADING",
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS",
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR",

  USER_FETCH: "USER_FETCH",
  USER_FETCH_LOADING: "USER_FETCH_LOADING",
  USER_FETCH_SUCCESS: "USER_FETCH_SUCCESS",
  USER_FETCH_ERROR: "USER_FETCH_ERROR",

  USER_LOGOUT: "USER_LOGOUT",
  USER_LOGOUT_SUCCESS: "USER_LOGOUT_SUCCESS",

  SERVICES_FETCH: "SERVICES_FETCH",
  SERVICES_FETCH_LOADING: "SERVICES_FETCH_LOADING",
  SERVICES_FETCH_SUCCESS: "SERVICES_FETCH_SUCCESS",
  SERVICES_FETCH_ERROR: "SERVICES_FETCH_ERROR",

  SERVICE_SELECT: "SERVICE_SELECT",

  CONFIG_FETCH: "CONFIG_FETCH",
  CONFIG_FETCH_LOADING: "CONFIG_FETCH_LOADING",
  CONFIG_FETCH_SUCCESS: "CONFIG_FETCH_SUCCESS",
  CONFIG_FETCH_ERROR: "CONFIG_FETCH_ERROR",

  CONFIG_UPDATE: "CONFIG_UPDATE",
  CONFIG_UPDATE_LOADING: "CONFIG_UPDATE_LOADING",
  CONFIG_UPDATE_SUCCESS: "CONFIG_UPDATE_SUCCESS",
  CONFIG_UPDATE_ERROR: "CONFIG_UPDATE_ERROR",

  CONFIG_CREATE: "CONFIG_CREATE",
  CONFIG_CREATE_LOADING: "CONFIG_CREATE_LOADING",
  CONFIG_CREATE_SUCCESS: "CONFIG_CREATE_SUCCESS",
  CONFIG_CREATE_ERROR: "CONFIG_CREATE_ERROR",

  CONFIG_DELETE: "CONFIG_DELETE",
  CONFIG_DELETE_LOADING: "CONFIG_DELETE_LOADING",
  CONFIG_DELETE_SUCCESS: "CONFIG_DELETE_SUCCESS",
  CONFIG_DELETE_ERROR: "CONFIG_DELETE_ERROR",

  NOTICES_FETCH: "NOTICES_FETCH",
  NOTICES_FETCH_LOADING: "NOTICES_FETCH_LOADING",
  NOTICES_FETCH_SUCCESS: "NOTICES_FETCH_SUCCESS",
  NOTICES_FETCH_ERROR: "NOTICES_FETCH_ERROR",

  NOTICE_FETCH_DATA: "NOTICE_FETCH_DATA",
  NOTICE_FETCH_DATA_LOADING: "NOTICE_FETCH_DATA_LOADING",
  NOTICE_FETCH_DATA_SUCCESS: "NOTICE_FETCH_DATA_SUCCESS",
  NOTICE_FETCH_DATA_ERROR: "NOTICE_FETCH_DATA_ERROR",

  NOTICE_DELETE: "NOTICE_DELETE",
  NOTICE_DELETE_LOADING: "NOTICE_DELETE_LOADING",
  NOTICE_DELETE_SUCCESS: "NOTICE_DELETE_SUCCESS",
  NOTICE_DELETE_ERROR: "NOTICE_DELETE_ERROR",

  NOTICE_ADD: "NOTICE_ADD",
  NOTICE_ADD_LOADING: "NOTICE_ADD_LOADING",
  NOTICE_ADD_SUCCESS: "NOTICE_ADD_SUCCESS",
  NOTICE_ADD_ERROR: "NOTICE_ADD_ERROR",

  NOTICE_SAVE: "NOTICE_SAVE",
  NOTICE_SAVE_LOADING: "NOTICE_SAVE_LOADING",
  NOTICE_SAVE_SUCCESS: "NOTICE_SAVE_SUCCESS",
  NOTICE_SAVE_ERROR: "NOTICE_SAVE_ERROR",
} as const;

export type UserState = StateSchema<
  {
    username: string;
    isAuth: boolean;
  },
  "login" | "logout" | "fetch"
>;

export type ServiceState = StateSchema<
  {
    serviceView: ServiceConfigView;
    serviceId: number;
    services: IService[];
  },
  "fetch"
>;

export type ConfigState = StateSchema<
  {
    configId: number;
    token: string;
    accountId: number;
    serviceId: number;
  },
  "create" | "delete" | "fetch"
>;

export type NoticeState = StateSchema<
  {
    notices: (INotice & WithRandomId)[];
    data: StateSchema<
      { values: INoticeValue[]; queries: INoticeQuery[] },
      "fetch"
    >;
  },
  "save" | "add" | "delete" | "fetch"
>;
// export type ServiceState = {
//   serviceId: number | null;
//   serviceView: ServiceConfigView;
//   services: StateSchema<ApiResponseData.Service.Service[]>;
//   config: StateSchema<{
//     token: string;
//     configId: number;
//     // Варианты событий (ревью не ревью)
//     actions: ApiResponseData.Service.Action[];
//     variables: ApiResponseData.Service.Variable[];
//     notices: ApiResponseData.Service.Notice[];
//   }>;
// };

export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
  service: ServiceState;
  notice: NoticeState;
  config: ConfigState;
}
