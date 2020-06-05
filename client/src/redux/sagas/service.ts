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

function* fetchServices() {
  yield call(
    fetchApi,
    ActionTypes.SERVICES_FETCH_LOADING,
    ActionTypes.SERVICES_FETCH_SUCCESS,
    ActionTypes.SERVICES_FETCH_ERROR,
    () => call(api.request, "/services", "GET")
  );
}

function* watchServiceSelect() {
  while (true) {
    const {
      payload: { serviceId, serviceView },
    } = (yield take(ActionTypes.SERVICE_SELECT)) as Action<"SERVICE_SELECT">;
    const currentServiceId = (yield select(
      (state: RootState) => state.config.serviceId
    )) as number;

    if (serviceId === currentServiceId) continue;
  }
}

function* watchServicesFetch() {
  while (true) {
    yield take(ActionTypes.SERVICES_FETCH);
    yield call(fetchServices);
  }
}

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([
      fork(watchServiceSelect),
      fork(watchServicesFetch),
    ]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}

function* watchActions() {
  // yield takeLatest(ActionTypes.SERVICES_FETCH)
}
