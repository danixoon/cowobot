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
};

declare type Action<
  A extends keyof ActionPayload = keyof ActionPayload
> = A extends keyof ActionPayload
  ? { type: A; payload: ActionPayload[A] }
  : never;

declare type StateSchema<T, A extends string = null> = {
  action: A | null;
  error: ApiError | null;
} & T;

declare type DataStatus = "idle" | "loading" | "success" | "error";
declare type ServiceConfigView = "control" | "config";
