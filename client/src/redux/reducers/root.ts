import { Reducer, combineReducers } from "redux";
import { Action } from "../store";
import popupReducer, { PopupState } from "./popup";

export interface RootState {
  popup: PopupState;
}

const rootReducer: Reducer<RootState, Action> = combineReducers({
  popup: popupReducer,
});

export default rootReducer;
