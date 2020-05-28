import { Reducer, combineReducers } from "redux";
import { Actions, RootState } from "../types";

import { userReducer } from "./user";
import { testReducer } from "./test";

const rootReducer: Reducer<RootState, Actions> = combineReducers({
  user: userReducer,
  test: testReducer,
});

export default rootReducer;
