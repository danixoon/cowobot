import { put, takeLatest, all } from "redux-saga/effects";
import { Action, ActionTypes, ActionType } from "../types";
function* fetchNews() {
  const json = yield fetch(
    "https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc"
  ).then((response) => response.json());
  yield put<Action>({
    type: ActionTypes.TEST_HELLO,
    payload: { message: "success" },
  });
}
function* actionWatcher() {
  yield takeLatest<ActionType>(ActionTypes.USER_LOGIN, fetchNews);
}
export default function* rootSaga() {
  yield all([actionWatcher()]);
}
