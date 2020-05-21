import * as React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Root from "../layout/Root";

const RootContainer: React.FC<any> = (props) => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default RootContainer;
