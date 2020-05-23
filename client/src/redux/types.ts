import * as popupActions from "./actions/popup";

export const mapState = (mapper: (state: RootState) => any) => mapper;

export const ActionTypes = {
  POPUP_PUSH: "POPUP.PUSH" as const,
  POPUP_REMOVE: "POPUP.REMOVE" as const,
  TEST_HELLO: "TEST.HELLO" as const,
};

export type Action = ReturnType<typeof popupActions[keyof typeof popupActions]>;

export interface PopupState {
  popups: [];
}

export interface TestState {
  message: string;
}

export interface RootState {
  popup: PopupState;
  test: TestState;
}

// export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

// export type ActionPayload<T> = {
//   [ActionTypes.POPUP_PUSH]: { name: string };
//   [ActionTypes.POPUP_REMOVE]: { name: string };
//   [ActionTypes.TEST_HELLO]: { name: boolean };
// }

// export type Action<T extends ActionType> = {
//   type: T;
//   payload: ActionPayload[T];
// }
