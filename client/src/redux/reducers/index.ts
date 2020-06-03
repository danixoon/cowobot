import { Reducer, combineReducers } from "redux";
import { RootState } from "../types";

import { userReducer } from "./user";
import { serviceReducer } from "./service";
import { testReducer } from "./test";

const rootReducer: Reducer<RootState, Action> = combineReducers({
  user: userReducer,
  test: testReducer,
  service: serviceReducer,
});

export default rootReducer;
