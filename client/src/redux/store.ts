import { createStore, Action as ReduxAction } from "redux";
import rootReducer, { RootState as ReducerRootState } from "./reducers/root";
import types from "./types";

export type RootState = ReducerRootState;
export type Action = ReduxAction<typeof types>;

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const store = createStore<RootState, Action, any, any>(
  rootReducer,
  devtoolsEnchancer && devtoolsEnchancer()
);
