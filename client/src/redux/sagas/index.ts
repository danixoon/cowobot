import { put, takeLatest, all, fork } from "redux-saga/effects";
import { Actions, ActionTypes, ActionType } from "../types";

import userSaga from "./user";

export default function* rootSaga() {
  yield all([fork(userSaga)]);
}
