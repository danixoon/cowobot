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

// function* fetchServices() {
//   try {
//     yield put(getAction(ActionTypes.SERVICES_FETCH_LOADING));
//   } catch (error) {
//     yield put(getAction(ActionTypes.SERVICES_FETCH_ERROR, error));
//   }
// }

function* fetchServices() {}

function* watchServiceSelect() {
  while (true) {
    const oldServiceId = yield select(
      (state: RootState) => state.service.serviceId
    );
    const {
      payload: { serviceId, serviceView },
    } = (yield take(ActionTypes.SERVICE_SELECT)) as Action<"SERVICE_SELECT">;

    if (serviceId === oldServiceId) continue;
    yield put(getAction(ActionTypes.SERVICE_CONFIG_FETCH, { serviceId }));
  }
}

function* watchServiceConfigFetch() {
  while (true) {
    const {
      payload: { serviceId },
    } = (yield take(ActionTypes.SERVICE_CONFIG_FETCH)) as Action<
      "SERVICE_CONFIG_FETCH"
    >;
    const serviceConfig = (yield fetchApi(
      getAction(ActionTypes.SERVICE_CONFIG_FETCH_LOADING),
      ActionTypes.SERVICE_CONFIG_FETCH_SUCCESS,
      ActionTypes.SERVICE_CONFIG_FETCH_ERROR,
      () =>
        call(api.request, "/service/config", "GET", { params: { serviceId } })
    )) as Action<"SERVICE_CONFIG_FETCH_SUCCESS">;

    if (serviceConfig)
      yield put(
        getAction(ActionTypes.CONFIG_FETCH, {
          configId: serviceConfig.payload.id,
        })
      );
  }
}

function* watchServicesFetch() {
  while (true) {
    yield take(ActionTypes.SERVICES_FETCH);
    yield fetchApi(
      getAction(ActionTypes.SERVICES_FETCH_LOADING),
      ActionTypes.SERVICES_FETCH_SUCCESS,
      ActionTypes.SERVICES_FETCH_ERROR,
      () => call(api.request, "/services", "GET")
    );
  }
}

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([
      fork(watchServiceSelect),
      fork(watchServicesFetch),
      fork(watchServiceConfigFetch),
    ]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}

function* watchActions() {
  // yield takeLatest(ActionTypes.SERVICES_FETCH)
}
