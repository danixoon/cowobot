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
  takeEvery,
} from "redux-saga/effects";
import { ActionTypes, RootState, getAction } from "../types";
import * as api from "../../api";
import { fetchApi } from ".";

// function* watchConfigCreate() {
//   while (true) {
//     const createAction = (yield take(ActionTypes.CONFIG_CREATE)) as Action<
//       "CONFIG_CREATE"
//     >;
//     const createdConfig = (yield fetchApi(
//       ActionTypes.CONFIG_CREATE_LOADING,
//       ActionTypes.CONFIG_CREATE_SUCCESS,
//       ActionTypes.CONFIG_CREATE_ERROR,
//       () =>
//         call(api.request, "/config", "POST", {
//           params: { serviceId: createAction.payload.serviceId },
//         })
//     )) as Action<"CONFIG_CREATE_SUCCESS">;

//     if (!createdConfig) continue;

//     yield put(
//       getAction(ActionTypes.NOTICES_FETCH, {
//         configId: createdConfig.payload.id,
//       })
//     );
//   }
// }

function* watchNoticesFetch() {
  while (true) {
    const {
      payload: { configId },
    } = (yield take(ActionTypes.NOTICES_FETCH)) as Action<"NOTICES_FETCH">;
    const notices = (yield fetchApi(
      getAction(ActionTypes.NOTICES_FETCH_LOADING),
      ActionTypes.NOTICES_FETCH_SUCCESS,
      ActionTypes.NOTICES_FETCH_ERROR,
      () => call(api.request, "/notices", "GET", { params: { configId } })
    )) as Action<"NOTICES_FETCH_SUCCESS">;

    if (notices)
      for (let notice of notices.payload) {
        yield put(getAction(ActionTypes.NOTICE_FETCH, { noticeId: notice.id }));
      }
  }
}

function* watchNoticeAdd() {
  yield takeEvery(ActionTypes.NOTICE_ADD, function* (
    action: Action<"NOTICE_ADD">
  ) {
    const notice = (yield fetchApi(
      getAction(ActionTypes.NOTICE_ADD_LOADING, {
        randomId: action.payload.randomId,
      }),
      ActionTypes.NOTICE_ADD_SUCCESS,
      ActionTypes.NOTICE_ADD_ERROR,
      () =>
        call(api.request, "/notice", "POST", {
          params: {
            configId: action.payload.configId,
            randomId: action.payload.randomId,
          },
          data: { messageTemplate: action.payload.messageTemplate },
        })
    )) as Action<"NOTICE_ADD_SUCCESS">;

    if (notice.payload) {
      yield put(
        getAction(ActionTypes.NOTICE_FETCH, {
          noticeId: notice.payload.id,
          randomId: action.payload.randomId,
        })
      );
    }
  });
}

function* watchNoticeSave() {
  yield takeEvery(ActionTypes.NOTICE_SAVE, function* (
    action: Action<"NOTICE_SAVE">
  ) {
    const result = (yield fetchApi(
      getAction(ActionTypes.NOTICE_SAVE_LOADING, {
        randomId: action.payload.randomId,
      }),
      ActionTypes.NOTICE_SAVE_SUCCESS,
      ActionTypes.NOTICE_SAVE_ERROR,
      () =>
        call(api.request, "/notice", "PUT", {
          data: {
            values: action.payload.values,
            queries: action.payload.queries,
            messageTemplate: action.payload.messageTemplate,
            actionId: action.payload.actionId,
            targetKey: action.payload.targetKey,
          },
          params: {
            noticeId: action.payload.noticeId,
            randomId: action.payload.randomId,
          },
        })
    )) as Action<"NOTICE_SAVE_SUCCESS">;

    if (!result.type.endsWith("_ERROR")) {
      yield put(
        getAction(ActionTypes.NOTICE_FETCH, {
          noticeId: action.payload.noticeId,
          randomId: action.payload.randomId,
        })
      );
    }
  });
}

function* watchNoticeDelete() {
  yield takeEvery(ActionTypes.NOTICE_DELETE, function* (
    notice: Action<"NOTICE_DELETE">
  ) {
    yield fetchApi(
      getAction(ActionTypes.NOTICE_DELETE_LOADING, {
        noticeId: notice.payload.noticeId,
        // randomId: notice.payload.randomId,
      }),
      ActionTypes.NOTICE_DELETE_SUCCESS,
      ActionTypes.NOTICE_DELETE_ERROR,
      () =>
        call(api.request, "/notice", "DELETE", {
          params: {
            noticeId: notice.payload.noticeId,
            // randomId: notice.payload.randomId,
          },
        })
    );
  });
  // while (true) {
  //   const notice = (yield take(ActionTypes.NOTICE_FETCH)) as Action<
  //     "NOTICE_FETCH"
  //   >;
}

function* watchNoticeFetch() {
  yield takeEvery(ActionTypes.NOTICE_FETCH, function* (
    notice: Action<"NOTICE_FETCH">
  ) {
    yield fetchApi(
      getAction(ActionTypes.NOTICE_FETCH_LOADING, {
        noticeId: notice.payload.noticeId,
      }),
      ActionTypes.NOTICE_FETCH_SUCCESS,
      ActionTypes.NOTICE_FETCH_ERROR,
      () =>
        call(api.request, "/notice", "GET", {
          params: {
            noticeId: notice.payload.noticeId,
            randomId: notice.payload.randomId,
          },
        })
    );
  });
  // while (true) {
  //   const notice = (yield take(ActionTypes.NOTICE_FETCH)) as Action<
  //     "NOTICE_FETCH"
  //   >;
}

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([
      fork(watchNoticesFetch),
      fork(watchNoticeFetch),
      fork(watchNoticeAdd),
      fork(watchNoticeSave),
      fork(watchNoticeDelete),
    ]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}
