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

function* watchConfigUpdate() {
  while (true) {
    const updateAction = (yield take(ActionTypes.CONFIG_UPDATE)) as Action<
      "CONFIG_UPDATE"
    >;
    const updatedConfig = (yield fetchApi(
      getAction(ActionTypes.CONFIG_UPDATE_LOADING),
      ActionTypes.CONFIG_UPDATE_SUCCESS,
      ActionTypes.CONFIG_UPDATE_ERROR,
      () =>
        call(api.request, "/config", "PUT", {
          params: { configId: updateAction.payload.configId },
          data: { token: updateAction.payload.token },
        })
    )) as Action<"CONFIG_UPDATE_SUCCESS">;

    if (!updatedConfig) continue;

    yield put(
      getAction(ActionTypes.CONFIG_FETCH, {
        configId: updatedConfig.payload.id,
      })
    );
  }
}

function* watchConfigDelete() {
  while (true) {
    const deleteAction = (yield take(ActionTypes.CONFIG_DELETE)) as Action<
      "CONFIG_DELETE"
    >;
    const deletedConfig = (yield fetchApi(
      getAction(ActionTypes.CONFIG_DELETE_LOADING),
      ActionTypes.CONFIG_DELETE_SUCCESS,
      ActionTypes.CONFIG_DELETE_ERROR,
      () =>
        call(api.request, "/config", "DELETE", {
          params: { configId: deleteAction.payload.configId },
        })
    )) as Action<"CONFIG_DELETE_SUCCESS">;

    if (deletedConfig.type.endsWith("_ERROR")) continue;

    const serviceId = (yield select(
      (state: RootState) => state.service.serviceId
    )) as number;

    yield put(
      getAction(ActionTypes.SERVICE_CONFIG_FETCH, {
        serviceId,
      })
    );
  }
}

function* watchFetchConfig() {
  yield takeLatest(ActionTypes.CONFIG_FETCH, function* (
    action: Action<"CONFIG_FETCH">
  ) {
    const config = (yield fetchApi(
      getAction(ActionTypes.CONFIG_FETCH_LOADING),
      ActionTypes.CONFIG_FETCH_SUCCESS,
      ActionTypes.CONFIG_FETCH_ERROR,
      () =>
        call(api.request, "/config", "GET", {
          params: { configId: action.payload.configId },
        })
    )) as Action<"CONFIG_FETCH_SUCCESS">;
    if (config.payload) {
      yield put(
        getAction(ActionTypes.NOTICES_FETCH, { configId: config.payload.id })
      );
    }
  });
  // while (true) {
  //   // const {
  //   //   payload: { configId },
  //   // } = (yield take()) as;
  // }
}

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([
      fork(watchConfigCreate),
      fork(watchFetchConfig),
      fork(watchConfigUpdate),
      fork(watchConfigDelete),
    ]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}
