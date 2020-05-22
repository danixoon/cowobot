import * as React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Root from "../layout/Root";
import PopupLayoutContainer from "./PopupLayoutContainer";

const RootContainer: React.FC<any> = (props) => (
  <Provider store={store}>
    <PopupLayoutContainer />
    <Root />
  </Provider>
);

export default RootContainer;
