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
import { ActionTypes, RootState } from "../types";
import * as api from "../../api/service";
import {
  serviceFetchError,
  serviceFetchSuccess,
  // configIdsFetchSuccess,
  configFetchSuccess,
  // configIdsFetch,
  configFetch,
  serviceFetch,
  configCreateSuccess,
  configCreateError,
  configDeleteSuccess,
  configDeleteError,
  // configIdsFetchError,
} from "../actions/service";

function* fetchServices() {
  try {
    const { data } = yield call(api.servicesFetch);
    yield put(serviceFetchSuccess(data));
  } catch (error) {
    yield put(serviceFetchError(error.response?.data.error ?? error));
  }
}

function* fetchServiceConfig(
  action: ActionMap.Action<typeof ActionTypes.CONFIG_FETCH>
) {
  try {
    const { data } = yield call(api.configFetch, action.payload.configId);
    yield put(
      configFetchSuccess({
        config: { ...data },
        serviceId: action.payload.serviceId,
      })
    );
  } catch (error) {
    yield put(serviceFetchError(error.response?.data.error ?? error));
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

function* serviceSelectFlow(
  action: ActionMap.Action<typeof ActionTypes.SERVICE_SELECT>
) {
  const { serviceId } = action.payload;
  const selectedServiceId = yield select(
    (state: RootState) => state.service?.serviceId
  );

  // Если выбранный id сервиса не поменялся - ничего не делаем
  if (selectedServiceId === serviceId) return;

  // Запускаем получение идентификаторов конфига
  const response = yield call(api.configIdsFetch, serviceId);
  let configId = response.data.length > 0 ? response.data[0] : null;

  // Если не пришло конфигураций - переключаем поведение на создание конфигурации
  if (typeof configId !== "number") {
    yield put(configFetchSuccess({ config: null, serviceId }));
  } else {
    yield put(configFetch(configId, serviceId));
    // yield call(fetchServiceConfig, serviceId, configId);
  }
}

// Создание конфигурации для сервиса для пользователя
function* createConfig(
  action: ActionMap.Action<typeof ActionTypes.CONFIG_CREATE>
) {
  const { serviceId } = action.payload;
  try {
    const { data } = yield call(api.configCreate, serviceId);
    yield put(configCreateSuccess({ configId: data.id }));
    yield put(configFetch(data.id, serviceId));
  } catch (error) {
    yield put(configCreateError(error.response?.data.error ?? error));
  }
}

// Создание конфигурации для сервиса для пользователя
function* deleteConfig(
  action: ActionMap.Action<typeof ActionTypes.CONFIG_DELETE>
) {
  const { configId } = action.payload;
  try {
    const { data } = yield call(api.configDelete, configId);
    yield put(configDeleteSuccess({ configId: data.id }));
  } catch (error) {
    yield put(configDeleteError(error.response?.data.error ?? error));
  }
}

function* watchService() {}

export default function* serviceFlow() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);

    const configCreateTask = yield fork(function* () {
      while (true)
        yield call(createConfig, yield take(ActionTypes.CONFIG_CREATE));
    });

    const configFetchTash = yield fork(function* () {
      while (true)
        yield call(fetchServiceConfig, yield take(ActionTypes.CONFIG_FETCH));
    });

    const fetchServicesTask = yield fork(function* () {
      while (true) {
        yield take(ActionTypes.SERVICE_FETCH);
        yield call(fetchServices);
      }
    });

    const serviceSelectTask = yield fork(function* () {
      while (true)
        yield call(serviceSelectFlow, yield take(ActionTypes.SERVICE_SELECT));
    });

    const configDeleteTask = yield fork(function* () {
      while (true)
        yield call(deleteConfig, yield take(ActionTypes.CONFIG_DELETE));
    });

    yield put(serviceFetch());

    yield take(ActionTypes.USER_LOGOUT);

    yield cancel([
      fetchServicesTask,
      serviceSelectTask,
      configCreateTask,
      configDeleteTask,
    ]);
  }
}
