import * as actionCreators from "./actions";
import { ApiError } from "../api/user";

export const mapState = (mapper: (state: RootState) => any) => mapper;

export const ActionTypes = {
  USER_LOGIN: "USER_LOGIN" as const,
  USER_LOGIN_SUCCESS: "USER_LOGIN_SUCCESS" as const,
  USER_LOGIN_ERROR: "USER_LOGIN_ERROR" as const,
  USER_LOGOUT: "USER_LOGOUT" as const,
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

export interface UserState
  extends StateSchema<{
    username: string;
    avatarUrl: string;
  }> {}
export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
}

export type DataStatus = "idle" | "loading" | "success" | "error";
