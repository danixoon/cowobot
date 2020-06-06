import {
  put,
  call,
  takeLatest,
  take,
  fork,
  race,
  all,
  select,
  cancel,
  CallEffect,
} from "redux-saga/effects";
import { ActionTypes, RootState, getAction } from "../types";
import * as api from "../../api";
import { fetchApi } from ".";

function* watchConfigCreate() {
  while (true) {
    const createAction = (yield take(ActionTypes.CONFIG_CREATE)) as Action<
      "CONFIG_CREATE"
    >;
    const createdConfig = (yield fetchApi(
      getAction(ActionTypes.CONFIG_CREATE_LOADING),
      ActionTypes.CONFIG_CREATE_SUCCESS,
      ActionTypes.CONFIG_CREATE_ERROR,
      () =>
        call(api.request, "/config", "POST", {
          params: { serviceId: createAction.payload.serviceId },
        })
    )) as Action<"CONFIG_CREATE_SUCCESS">;

    if (!createdConfig) continue;

    yield put(
      getAction(ActionTypes.CONFIG_FETCH, {
        configId: createdConfig.payload.id,
      })
    );
  }
}

function* watchFetchConfig() {
  while (true) {
    const {
      payload: { configId },
    } = (yield take(ActionTypes.CONFIG_FETCH)) as Action<"CONFIG_FETCH">;
    const config = (yield fetchApi(
      getAction(ActionTypes.CONFIG_FETCH_LOADING),
      ActionTypes.CONFIG_FETCH_SUCCESS,
      ActionTypes.CONFIG_FETCH_ERROR,
      () => call(api.request, "/config", "GET", { params: { configId } })
    )) as Action<"CONFIG_FETCH_SUCCESS">;
    if (config) {
      yield put(
        getAction(ActionTypes.NOTICES_FETCH, { configId: config.payload.id })
      );
    }
  }
}

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([fork(watchConfigCreate), fork(watchFetchConfig)]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}
