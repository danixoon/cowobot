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
} from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions, RootState } from "../types";
import * as api from "../../api/service";
import {
  serviceFetchError,
  serviceFetchSuccess,
  // configIdsFetchSuccess,
  configFetchSuccess,
  // configIdsFetch,
  configFetch,
  serviceFetch,
  // configIdsFetchError,
} from "../actions/service";

function* fetchServices() {
  try {
    const { data } = yield call(api.servicesFetch);
    yield put(serviceFetchSuccess(data));
  } catch (error) {
    yield put(serviceFetchError(error.response.data.error));
  }
}

function* fetchServiceConfig(serviceId: number, configId: number) {
  try {
    const { data } = yield call(api.configFetch, configId);
    yield put(configFetchSuccess({ ...data, configId, serviceId }));
  } catch (error) {
    yield put(serviceFetchError(error.response.data.error));
  }
}

// function* fetchConfigIds(serviceId: number) {
//   yield put(configIdsFetch(serviceId));
//   try {
//     const { data } = yield call(api.configIdsFetch, serviceId);
//     yield put(configIdsFetchSuccess(data));
//   } catch (error) {
//     yield put(configIdsFetchError(error.response.data.error));
//   }
// }

// Обрабтка логики

function* serviceSelectFlow(action: Action<typeof ActionTypes.SERVICE_SELECT>) {
  const { serviceId } = action.payload;
  const selectedServiceId = yield select(
    (state: RootState) => state.service.config.data?.serviceId
  );

  // Если выбранный id сервиса не поменялся - ничего не делаем
  if (selectedServiceId === serviceId) return;

  // Запускаем получение идентификаторов конфига
  const response = yield call(api.configIdsFetch, serviceId);
  let configId = response.data[0]?.id;

  // Если не пришло конфигураций - переключаем поведение на создание конфигурации
  if (typeof configId !== "number") yield put(configFetchSuccess(null));
  else yield call(fetchServiceConfig, serviceId, configId);
}

function* createServiceFlow(serviceId: number) {
  yield take();
}

export default function* serviceFlow() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);

    const fetchServicesTask = yield takeLatest(
      ActionTypes.SERVICE_FETCH,
      fetchServices
    );
    const serviceSelectTask = yield takeLatest(
      ActionTypes.SERVICE_SELECT,
      serviceSelectFlow
    );

    yield put(serviceFetch());

    yield take(ActionTypes.USER_LOGOUT);

    yield cancel([fetchServicesTask, serviceSelectTask]);
  }
}
