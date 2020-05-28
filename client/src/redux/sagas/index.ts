import { put, takeLatest, all, fork } from "redux-saga/effects";
import { Actions, ActionTypes, ActionType } from "../types";

import userSaga from "./user";

// function* fetchNews() {
//   const json = yield fetch(
//     "https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc"
//   ).then((response) => response.json());
//   yield put<Action>({
//     type: ActionTypes.TEST_HELLO,
//     payload: { message: "success" },
//   });
// }
// function* watchSagas() {
//   yield takeLatest<ActionType>(ActionTypes.USER_LOGIN, fetchNews);
// }
export default function* rootSaga() {
  yield all([fork(userSaga)]);
}
