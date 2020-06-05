import { Reducer, combineReducers } from "redux";
import { RootState } from "../types";

import { userReducer } from "./user";
import { noticeReducer } from "./notice";
import { testReducer } from "./test";
import { serviceReducer } from "./service";
import { configReducer } from "./config";

const rootReducer: Reducer<RootState, Action> = combineReducers({
  user: userReducer,
  test: testReducer,
  notice: noticeReducer,
  service: serviceReducer,
  config: configReducer,
});

export default rootReducer;
