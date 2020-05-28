import * as api from "../../api/user";
import { put, call, takeLatest } from "redux-saga/effects";
import { ActionTypes, ActionType, Action, Actions } from "../types";
import { userLoginSuccess } from "../actions/user";
import { apiError } from "../actions";

function* loginUser(action: Action<typeof ActionTypes.USER_LOGIN>) {
  const { username, password } = action.payload;

  try {
    const request = yield call(api.loginUser, username, password);
    yield put<Actions>(userLoginSuccess(request.data));
  } catch (error) {
    yield put<Actions>(apiError(ActionTypes.USER_LOGIN_ERROR, error));
  }

  yield put<Actions>({
    type: ActionTypes.TEST_HELLO,
    payload: { message: "success" },
  });
}

export default function* watchSagas() {
  yield takeLatest(ActionTypes.USER_LOGIN, loginUser);
}
