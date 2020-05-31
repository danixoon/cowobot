import { createStore, applyMiddleware, compose, Store } from "redux";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { RootState } from "./types";
import rootSaga from "./sagas";

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore<RootState, ActionMap.Actions, any, any>(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware, logger),
    devtoolsEnchancer ? devtoolsEnchancer() : (store: any) => store
  )
) as Store<RootState, ActionMap.Actions>;

sagaMiddleware.run(rootSaga);
