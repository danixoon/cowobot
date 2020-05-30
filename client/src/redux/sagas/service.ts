import {
  put,
  call,
  takeLatest,
  take,
  fork,
  race,
  all,
} from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions } from "../types";
import * as api from "../../api/service";
import {
  serviceFetchError,
  serviceFetchSuccess,
  serviceConfigsFetchSuccess,
  serviceConfigFetchSuccess,
} from "../actions/service";

function* fetchServices() {
  const { data } = yield call(api.servicesFetch);
  yield put(serviceFetchSuccess(data));
}

function* fetchServiceConfig(configId: string) {
  // yield
  const { data } = yield call(api.serviceConfigFetch, configId);
  yield put(serviceConfigFetchSuccess({ ...data, configId }));
}

function* fetchServiceConfigs(serviceId: string) {
  const { data } = yield call(api.serviceConfigsFetch, serviceId);
  yield put(serviceConfigsFetchSuccess(data));
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

// Обрабатывает выбор сервиса и выводит конфигурацию оповещений
function* watchServiceSelect() {
  while (true) {
    // Сервис выбран
    const {
      payload: { serviceId },
    } = (yield take(ActionTypes.SERVICE_SELECT)) as Action<
      typeof ActionTypes.SERVICE_SELECT
    >;

    yield fork(fetchServiceConfigs, serviceId);

    const { payload } = (yield take(
      ActionTypes.SERVICE_CONFIGS_FETCH_SUCCESS
    )) as Action<typeof ActionTypes.SERVICE_CONFIGS_FETCH_SUCCESS>;
    if (payload.length === 0) continue;

    const configId = payload[0].id;

    try {
      yield call(fetchServiceConfig, configId);
    } catch (error) {
      yield put(serviceFetchError(error.response.data.error));
    }
  }
}

export default function* serviceFlow() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const { logout } = yield race({
      watchers: race([call(watchServiceFetch), call(watchServiceSelect)]),
      logout: take(ActionTypes.USER_LOGOUT),
    });
    if (!logout) console.error("saga terminated");
  }
}
