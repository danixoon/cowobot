import { createStore, Action as ReduxAction } from "redux";
import rootReducer from "./reducers/root";
import { Action, RootState } from "./types";

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const store = createStore<RootState, Action, any, any>(
  rootReducer,
  devtoolsEnchancer && devtoolsEnchancer()
);
