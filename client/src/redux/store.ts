import { createStore } from "redux";
import rootReducer from "./reducers/root";

const devtoolsEnchancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const store = createStore(
  rootReducer,
  devtoolsEnchancer && devtoolsEnchancer()
);
