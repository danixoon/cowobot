import * as actionCreators from "./actions";
import { ApiError } from "../api";

export const mapState = (mapper: (state: RootState) => any) => mapper;

export const ActionTypes = {
  USER_LOGIN: "USER_LOGIN" as const,
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS" as const,
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR" as const,
  USER_LOGOUT: "USER_LOGOUT" as const,
  SERVICE_FETCH: "SERVICE_FETCH" as const,
  SERVICE_FETCH_SUCCESS: "SERVICE_FETCH_SUCCESS" as const,
  SERVICE_FETCH_ERROR: "SERVICE_FETCH_ERROR" as const,
  SERVICE_SELECT: "SERVICE_SELECT" as const,

  SERVICE_CONFIG_FETCH: "SERVICE_CONFIG_FETCH" as const,
  SERVICE_CONFIG_FETCH_SUCCESS: "SERVICE_CONFIG_FETCH_SUCCESS" as const,
  SERVICE_CONFIG_FETCH_ERROR: "SERVICE_CONFIG_FETCH_ERROR" as const,

  SERVICE_CONFIGS_FETCH: "SERVICE_CONFIGS_FETCH" as const,
  SERVICE_CONFIGS_FETCH_SUCCESS: "SERVICE_CONFIGS_FETCH_SUCCESS" as const,
  SERVICE_CONFIGS_FETCH_ERROR: "SERVICE_CONFIGS_FETCH_ERROR" as const,

  TEST_HELLO: "TEST_HELLO" as const,
};

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

export type Actions = ReturnType<
  typeof actionCreators[keyof typeof actionCreators]
>;

export type Action<T extends ActionType> = Extract<Actions, { type: T }>;
export type StateSchema<T> = {
  data: T;
  status: DataStatus;
  error: ApiError | null;
};

export type UserState = StateSchema<{
  username: string;
  avatarUrl: string;
  token: string | null;
}>;

export type ServiceState = StateSchema<{
  services: {
    id: string;
    name: string;
  }[];

  selectedService: null | {
    id: string;
    // Варианты событий (ревью не ревью)
    notices: { id: string; name: string }[];
    variables: {
      name: string;
      defaultValue: string;
      isTarget: boolean;
    }[];
  };
}>;

export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
  service: ServiceState;
}

export type DataStatus = "idle" | "loading" | "success" | "error";
