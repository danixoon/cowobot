import { put, takeLatest, all, fork, CallEffect } from "redux-saga/effects";
import { ActionTypes, getAction } from "../types";

import userSaga from "./user";
import serviceSaga from "./service";
import authSaga from "./auth";

export default function* rootSaga() {
  yield all([fork(authSaga), fork(userSaga), fork(serviceSaga)]);
}

export function* fetchApi(
  loading: keyof ActionPayload,
  succes: keyof ActionPayload,
  error: keyof ActionPayload,
  cb: () => CallEffect
) {
  yield put(getAction(loading));
  try {
    const result = yield cb();
    yield put(getAction(succes, result));
    return result;
  } catch (e) {
    yield put(getAction(error, e));
  }
}
