import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/root";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { Action, RootState } from "./types";
import rootSaga from "./sagas";

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore<RootState, Action, any, any>(
  rootReducer,
  applyMiddleware(
    devtoolsEnchancer && devtoolsEnchancer(),
    sagaMiddleware,
    logger
  )
);

sagaMiddleware.run(rootSaga);
