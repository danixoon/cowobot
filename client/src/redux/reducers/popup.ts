import { Reducer } from "redux";
import { ActionTypes, Action, PopupState } from "../types";

const defaultState: () => PopupState = () => ({ popups: [] });

export const popupReducer: Reducer<PopupState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.POPUP_PUSH:
      action.payload.hi;
      return state;
    case ActionTypes.POPUP_REMOVE:
      action.payload.hi;
      return state;
    default:
      return state;
  }
};
