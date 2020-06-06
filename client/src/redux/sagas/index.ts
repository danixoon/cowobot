import { put, takeLatest, all, fork, CallEffect } from "redux-saga/effects";
import { ActionTypes, getAction } from "../types";

import userSaga from "./user";
import serviceSaga from "./service";
import authSaga from "./auth";
import configSaga from "./config";
import noticeSaga from "./notice";

export function* fetchApi(
  loading: Action,
  succes: keyof ActionPayload,
  error: keyof ActionPayload,
  cb: () => CallEffect
) {
  yield put(loading);
  try {
    const payload = yield cb();
    const action = getAction(succes, payload);
    yield put(action);
    return action;
  } catch (e) {
    yield put(getAction(error, e.response?.data?.error ?? e));
  }
}

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userSaga),
    fork(serviceSaga),
    fork(configSaga),
    fork(noticeSaga),
  ]);
}
