import * as React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Root from "../layout/Root";
import PopupLayoutProvider from "../providers/PopupLayoutProvider";
import PopupLayout from "../layout/PopupLayout";

const RootContainer: React.FC<any> = (props) => (
  <Provider store={store}>
    <PopupLayoutProvider>
      <Root />
    </PopupLayoutProvider>
  </Provider>
);

export default RootContainer;
