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
  takeEvery,
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

function* watchServiceViewSelect() {
  // while (true) {
  //   const {
  //     payload: { serviceView },
  //   } = (yield take(ActionTypes.SERVICE_VIEW_SELECT)) as Action<
  //     "SERVICE_VIEW_SELECT"
  //   >;
  //   // if (serviceId === oldServiceId) continue;
  //   yield put(getAction(ActionTypes.SERVICE_CONFIG_FETCH, { serviceId }));
  // }
}

function* watchServiceSelect() {
  yield takeLatest(ActionTypes.SERVICE_SELECT, function* (
    action: Action<"SERVICE_SELECT">
  ) {
    yield put(
      getAction(ActionTypes.SERVICE_CONFIG_FETCH, {
        serviceId: action.payload.serviceId,
      })
    );
  });
  // while (true) {
  //   // const {
  //   //   payload: { serviceId },
  //   // } = (yield take(ActionTypes.SERVICE_SELECT)) as ;
  //   // if (serviceId === oldServiceId) continue;
  // }
}

function* watchServiceConfigFetch() {
  // yield takeEvery()
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

    if (serviceConfig.payload)
      yield put(
        getAction(ActionTypes.CONFIG_FETCH, {
          configId: serviceConfig.payload.id,
        })
      );
    else yield put(getAction(ActionTypes.CONFIG_FETCH_SUCCESS, null));
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
