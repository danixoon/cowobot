import * as api from "../../api/user";
import { put, call, takeLatest } from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions } from "../types";
import { userLoginSuccess, userLoginError } from "../actions/user";

function* loginUser(action: Action<typeof ActionTypes.USER_LOGIN>) {
  const { username, password } = action.payload;

  try {
    const request = (yield call(
      api.userLogin,
      username,
      password
    )) as api.ApiSuccessReponse;

    yield put<Actions>(userLoginSuccess({ ...request.data, username }));
  } catch (error) {
    yield put<Actions>(userLoginError(error.response.data.error));
  }
}

export default function* watchSagas() {
  yield takeLatest(ActionTypes.USER_LOGIN, loginUser);
}
