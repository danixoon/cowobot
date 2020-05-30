import * as actionCreators from "./actions";
import { ApiError } from "../api";

export const mapState = (mapper: (state: RootState) => any) => mapper;

export const ActionTypes = {
  USER_LOGIN: "USER_LOGIN" as const,
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS" as const,
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR" as const,
  USER_LOGOUT: "USER_LOGOUT" as const,
  USER_LOGOUT_SUCCESS: "USER_LOGOUT_SUCCESS" as const,

  // Получение известных сервисов
  SERVICE_FETCH: "SERVICE_FETCH" as const,
  SERVICE_FETCH_SUCCESS: "SERVICE_FETCH_SUCCESS" as const,
  SERVICE_FETCH_ERROR: "SERVICE_FETCH_ERROR" as const,

  // Выбор сервиса на дереве
  SERVICE_SELECT: "SERVICE_SELECT" as const,

  // Получение конфигурации по идентификатору
  CONFIG_FETCH: "CONFIG_FETCH" as const,
  CONFIG_FETCH_SUCCESS: "CONFIG_FETCH_SUCCESS" as const,
  CONFIG_FETCH_ERROR: "CONFIG_FETCH_ERROR" as const,

  // Создание конфигурации для сервиса
  CONFIG_CREATE: "CONFIG_FETCH" as const,
  CONFIG_CREATE_SUCCESS: "CONFIG_CREATE_SUCCESS" as const,
  CONFIG_CREATE_ERROR: "CONFIG_CREATE_ERROR" as const,

  // // Получение идентификаторов известных конфигураций
  // CONFIG_IDS_FETCH: "CONFIG_IDS_FETCH" as const,
  // CONFIG_IDS_FETCH_SUCCESS: "CONFIG_IDS_FETCH_SUCCESS" as const,
  // CONFIG_IDS_FETCH_ERROR: "CONFIG_IDS_FETCH_ERROR" as const,

  TEST_HELLO: "TEST_HELLO" as const,
};

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

export type Actions = ReturnType<
  typeof actionCreators[keyof typeof actionCreators]
>;

export type Action<T extends ActionType> = Extract<Actions, { type: T }>;
export type StateSchema<T> = {
  status: DataStatus;
  error: ApiError | null;
  data: T | null;
};

export type UserState = StateSchema<{
  username: string;
  token: string | null;
}>;

export type ServiceState = {
  services: StateSchema<
    {
      id: number;
      name: string;
    }[]
  >;
  config: StateSchema<{
    configId: number;
    serviceId: number;
    // Варианты событий (ревью не ревью)
    actions: { id: number; name: string }[];
    variables: {
      customKey: string | null;
      defaultKey: string;
      isTarget: boolean;
    }[];
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

export type DataStatus = "idle" | "loading" | "success" | "error";
