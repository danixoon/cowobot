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
import { ActionTypes, RootState, getAction } from "../types";
import * as api from "../../api/service";

function* fetchServices() {
  try {
    const { data } = yield call(api.servicesFetch);
    yield put(getAction(ActionTypes.SERVICE_FETCH_SUCCESS, data));
  } catch (error) {
    yield put(
      getAction(
        ActionTypes.SERVICE_FETCH_ERROR,
        error.response?.data.error ?? error
      )
    );
    // yield put(serviceFetchError(error.response?.data.error ?? error));
  }
}

function* fetchServiceConfig(action: Action<typeof ActionTypes.CONFIG_FETCH>) {
  try {
    const { data } = yield call(api.configFetch, action.payload.configId);
    yield put(
      getAction(ActionTypes.CONFIG_FETCH_SUCCESS, {
        config: { ...data },
        serviceId: action.payload.serviceId,
      })
    );
  } catch (error) {
    yield put(
      getAction(
        ActionTypes.SERVICE_FETCH_ERROR,
        error.response?.data.error ?? error
      )
    );
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
    (state: RootState) => state.service?.serviceId
  );

  // Если выбранный id сервиса не поменялся - ничего не делаем
  if (selectedServiceId === serviceId) return;

  // Запускаем получение идентификаторов конфига
  const response = yield call(api.configIdsFetch, serviceId);
  let configId = response.data.length > 0 ? response.data[0] : null;

  // Если не пришло конфигураций - переключаем поведение на создание конфигурации
  if (typeof configId !== "number") {
    yield put(
      getAction(ActionTypes.CONFIG_FETCH_SUCCESS, { config: null, serviceId })
    );
  } else {
    yield put(getAction(ActionTypes.CONFIG_FETCH, { configId, serviceId }));
    // yield call(fetchServiceConfig, serviceId, configId);
  }
}

// Создание конфигурации для сервиса для пользователя
function* createConfig(action: Action<typeof ActionTypes.CONFIG_CREATE>) {
  const { serviceId } = action.payload;
  try {
    const { data } = yield call(api.configCreate, serviceId);
    yield put(
      getAction(ActionTypes.CONFIG_CREATE_SUCCESS, { configId: data.id })
    );
    yield put(
      getAction(ActionTypes.CONFIG_FETCH, { configId: data.id, serviceId })
    );
  } catch (error) {
    yield put(
      getAction(
        ActionTypes.CONFIG_CREATE_ERROR,
        error.response?.data.error ?? error
      )
    );
  }
}

// Создание конфигурации для сервиса для пользователя
function* deleteConfig(action: Action<typeof ActionTypes.CONFIG_DELETE>) {
  const { configId } = action.payload;
  try {
    const { data } = yield call(api.configDelete, configId);
    yield put(
      getAction(ActionTypes.CONFIG_DELETE_SUCCESS, { configId: data.id })
    );
  } catch (error) {
    yield put(
      getAction(
        ActionTypes.CONFIG_DELETE_ERROR,
        error.response?.data.error ?? error
      )
    );
  }
}

// Создание конфигурации для сервиса для пользователя
function* saveConfig(action: Action<typeof ActionTypes.CONFIG_SAVE>) {
  const data = action.payload;
  try {
    yield call(api.configSave, data);
    yield put(getAction(ActionTypes.CONFIG_SAVE_SUCCESS));
  } catch (error) {
    yield put(
      getAction(
        ActionTypes.CONFIG_SAVE_ERROR,
        error.response?.data.error ?? error
      )
    );
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

    const configFetchTask = yield fork(function* () {
      while (true)
        yield call(fetchServiceConfig, yield take(ActionTypes.CONFIG_FETCH));
    });

    const configSaveTask = yield fork(function* () {
      while (true) {
        yield call(saveConfig, yield take(ActionTypes.CONFIG_SAVE));
        const { configId, serviceId } = yield select((state: RootState) => ({
          serviceId: state.service.serviceId,
          configId: state.service.config.data?.configId,
        }));
        yield put(getAction(ActionTypes.CONFIG_FETCH, { configId, serviceId }));
      }
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

    yield put(getAction(ActionTypes.SERVICE_FETCH));

    yield take(ActionTypes.USER_LOGOUT);

    yield cancel([
      fetchServicesTask,
      serviceSelectTask,
      configSaveTask,
      configFetchTask,
      configCreateTask,
      configDeleteTask,
    ]);
  }
}
