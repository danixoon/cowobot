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
          params: { noticeId: notice.payload.noticeId },
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
    const tasks = yield all([fork(watchNoticesFetch), fork(watchNoticeFetch)]);
    yield put(getAction(ActionTypes.SERVICES_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}
