import * as actionCreators from "./actions";

export const mapState = (mapper: (state: RootState) => any) => mapper;

export const ActionTypes = {
  USER_LOGIN: "USER_LOGIN" as const,
  USER_LOGOUT: "USER_LOGOUT" as const,
  TEST_HELLO: "TEST_HELLO" as const,
};

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

export type Action = ReturnType<
  typeof actionCreators[keyof typeof actionCreators]
>;

export interface UserState {
  username: string;
  avatarUrl: string;
}

export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
}
