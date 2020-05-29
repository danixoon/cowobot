import * as api from "../../api/user";
import axios from "axios";
import { put, call, takeLatest, take, fork } from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions } from "../types";
import { userLoginSuccess, userLoginError, userLogout } from "../actions/user";
import { ApiSuccessReponse } from "../../api";

function* loginUser(action: Action<typeof ActionTypes.USER_LOGIN>) {
  const { username, password } = action.payload;

  try {
    const request = (yield call(
      api.userLogin,
      username,
      password
    )) as ApiSuccessReponse<ReturnType<typeof userLoginSuccess>["payload"]>;

    window.localStorage.setItem("token", request.data.token);
    yield put<Actions>(userLoginSuccess({ ...request.data, username }));
  } catch (error) {
    yield put<Actions>(userLoginError(error.response.data.error));
  }
}

function* logoutUser() {
  window.localStorage.removeItem("token");
  yield put(userLogout());
}

export default function* userFlow() {
  const token = window.localStorage.getItem("token");
  if (token) {
    try {
      const request = yield call(api.userFetchData);
      const { username } = request.data;
      yield put(userLoginSuccess({ token, username }));
      yield take(ActionTypes.USER_LOGOUT);
    } catch (error) {
      console.log(error);
      yield fork(logoutUser);
    }
  }

  while (true) {
    const data = (yield take(ActionTypes.USER_LOGIN)) as Action<
      typeof ActionTypes.USER_LOGIN
    >;
    yield fork(loginUser, data);
    yield take([ActionTypes.USER_LOGOUT, ActionTypes.USER_LOGIN_ERROR]);
  }
}
