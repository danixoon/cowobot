import {
  put,
  takeLatest,
  all,
  fork,
  CallEffect,
  StrictEffect,
} from "redux-saga/effects";
import { ActionTypes, getAction } from "../types";

import userSaga from "./user";
import serviceSaga from "./service";
import authSaga from "./auth";
import configSaga from "./config";
import noticeSaga from "./notice";

export function* fetchApi<
  S extends keyof ActionPayload,
  E extends keyof ActionPayload
>(
  loading: Action,
  success: S,
  error: E,
  cb: () => CallEffect
): Generator<StrictEffect, Action<S> | Action<E>, any> {
  yield put(loading);
  try {
    const payload = yield cb();
    const action = getAction(success, payload);
    yield put(action);
    return action as Action<S>;
  } catch (e) {
    const err = getAction(error, e.response?.data?.error ?? e);
    yield put(err);
    return err as Action<E>;
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
