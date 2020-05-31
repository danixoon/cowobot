import { put, takeLatest, all, fork } from "redux-saga/effects";
import { ActionTypes } from "../types";

import userSaga from "./user";
import serviceSaga from "./service";

export default function* rootSaga() {
  yield all([fork(userSaga), fork(serviceSaga)]);
}
