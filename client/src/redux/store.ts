import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/root";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { Actions, RootState } from "./types";
import rootSaga from "./sagas";

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore<RootState, Actions, any, any>(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware, logger),
    devtoolsEnchancer && devtoolsEnchancer()
  )
);

sagaMiddleware.run(rootSaga);
