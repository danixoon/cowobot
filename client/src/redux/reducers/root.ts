import { Reducer, combineReducers } from "redux";
import { Action, RootState } from "../types";

import { popupReducer } from "./popup";
import { testReducer } from "./test";

const rootReducer: Reducer<RootState, Action> = combineReducers({
  popup: popupReducer,
  test: testReducer,
});

export default rootReducer;
