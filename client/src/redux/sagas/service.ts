import { put, call, takeLatest, take, fork, race } from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions } from "../types";
import * as api from "../../api/service";
import { serviceFetchError, serviceFetchSuccess } from "../actions/service";

function* fetchServices() {
  const { data } = yield call(api.servicesFetch);
  yield put(serviceFetchSuccess(data));
}

function* watchServiceFetch() {
  while (true) {
    try {
      yield call(fetchServices);
    } catch (error) {
      yield put(serviceFetchError(error.response.data.error));
    }

    yield take(ActionTypes.SERVICE_FETCH);
  }
}

export default function* serviceFlow() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const { logout } = yield race({
      watchers: call(watchServiceFetch),
      logout: take(ActionTypes.USER_LOGOUT),
    });
    if (!logout) console.error("saga terminated");
  }
}
