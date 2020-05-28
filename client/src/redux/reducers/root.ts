import { Reducer, combineReducers } from "redux";
import { Action, RootState } from "../types";

import { userReducer } from "./user";
import { testReducer } from "./test";

const rootReducer: Reducer<RootState, Action> = combineReducers({
  user: userReducer,
  test: testReducer,
});

export default rootReducer;
