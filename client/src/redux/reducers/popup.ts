import { Reducer, Action } from "redux";
import { TYPES, POPUP } from "../types";

export interface PopupState {
  popups: [];
}

const defaultState: () => PopupState = () => ({ popups: [] });

const popupReducer: Reducer<
  PopupState,
  Action<typeof POPUP[keyof typeof POPUP]>
> = (state = defaultState(), action) => {
  switch (action.type) {
    case POPUP.ADD:
      return state;
    default:
      return state;
  }
};

export default popupReducer;
