// import * as api from "../../api/user";
// import axios from "axios";
// import { put, call, takeLatest, take, fork } from "redux-saga/effects";
// import { ActionTypes, getAction } from "../types";

import { take, all, fork, cancel, race, put, call } from "redux-saga/effects";
import { ActionTypes, getAction } from "../types";
import * as api from "../../api";
import { fetchApi } from ".";

// function* loginUser(action: Action<typeof ActionTypes.USER_LOGIN>) {
//   const { username, password } = action.payload;

//   try {
//     // TODO бахнуть типизации
//     const request = yield call(api.userLogin, username, password);
//     window.localStorage.setItem("token", request.data.token);
//     yield put(
//       getAction(ActionTypes.USER_LOGIN_SUCCESS, { ...request.data, username })
//     );
//   } catch (error) {
//     yield put(
//       getAction(ActionTypes.USER_LOGIN_ERROR, error.response.data.error)
//     );
//   }
// }

// function* logoutUser() {
//   window.localStorage.removeItem("token");
//   yield put(getAction(ActionTypes.USER_LOGOUT_SUCCESS));
// }

// export default function* userFlow() {
//   const token = window.localStorage.getItem("token");
//   // return;
//   let isAuth = false;
//   if (token) {
//     try {
//       const request = yield call(api.userFetchData);
//       const { username } = request.data;
//       yield put(getAction(ActionTypes.USER_LOGIN_SUCCESS, { token, username }));
//       isAuth = true;
//     } catch (error) {
//       console.log(error);
//       yield fork(logoutUser);
//     }
//   }

//   while (true) {
//     if (!isAuth) {
//       const data = (yield take(ActionTypes.USER_LOGIN)) as Action<
//         typeof ActionTypes.USER_LOGIN
//       >;
//       yield fork(loginUser, data);
//     }
//     yield take([ActionTypes.USER_LOGOUT, ActionTypes.USER_LOGIN_ERROR]);
//     yield logoutUser();
//     isAuth = false;
//   }
// }

// function* watchUserLogin() {
//   while (true) {
//     yield take(ActionTypes.USER_LOGIN);
//   }
// }

export default function* watchSagas() {
  while (true) {
    yield take(ActionTypes.USER_LOGIN_SUCCESS);
    const tasks = yield all([
      fork(watchUserFetch),
      // fork(watchServicesFetch),
    ]);
    yield put(getAction(ActionTypes.USER_FETCH));
    yield take(ActionTypes.USER_LOGOUT_SUCCESS);
    yield cancel(tasks);
  }
}

function* userFetch() {
  yield fetchApi(
    getAction(ActionTypes.USER_FETCH_LOADING),
    ActionTypes.USER_FETCH_SUCCESS,
    ActionTypes.USER_FETCH_ERROR,
    () => call(api.request, "/user", "GET")
  );
}

function* watchUserFetch() {
  while (true) {
    yield take(ActionTypes.USER_FETCH);
    yield call(userFetch);
  }
  // yield takeLatest(ActionTypes.SERVICES_FETCH)
}
