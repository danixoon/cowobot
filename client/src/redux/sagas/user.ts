import * as api from "../../api/user";
import axios from "axios";
import { put, call, takeLatest, take, fork } from "redux-saga/effects";
import { ActionTypes } from "../types";
import {
  userLoginSuccess,
  userLoginError,
  userLogout,
  userLogoutSuccess,
} from "../actions/user";

function* loginUser(action: ActionMap.Action<typeof ActionTypes.USER_LOGIN>) {
  const { username, password } = action.payload;

  try {
    const request = (yield call(
      api.userLogin,
      username,
      password
    )) as ApiSuccessReponse<ReturnType<typeof userLoginSuccess>["payload"]>;

    window.localStorage.setItem("token", request.data.token);
    yield put<ActionMap.Actions>(
      userLoginSuccess({ ...request.data, username })
    );
  } catch (error) {
    yield put<ActionMap.Actions>(userLoginError(error.response.data.error));
  }
}

function* logoutUser() {
  window.localStorage.removeItem("token");
  yield put(userLogoutSuccess());
}

export default function* userFlow() {
  const token = window.localStorage.getItem("token");
  let isAuth = false;
  if (token) {
    try {
      const request = yield call(api.userFetchData);
      const { username } = request.data;
      yield put(userLoginSuccess({ token, username }));
      isAuth = true;
    } catch (error) {
      console.log(error);
      yield fork(logoutUser);
    }
  }

  while (true) {
    if (!isAuth) {
      const data = (yield take(ActionTypes.USER_LOGIN)) as ActionMap.Action<
        typeof ActionTypes.USER_LOGIN
      >;
      yield fork(loginUser, data);
    }
    yield take([ActionTypes.USER_LOGOUT, ActionTypes.USER_LOGIN_ERROR]);
    yield logoutUser();
    isAuth = false;
  }
}
