import * as React from "react";
import { Provider, connect } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Route } from "react-router-dom";

import RootLayout, { RootLayoutProps } from "./layout/RootLayout";
import PopupLayoutProvider from "./providers/PopupLayoutProvider";
import { RootState } from "./redux/types";
import RootContainer from "./containers/RootContainer";

import "./sass/default.scss";

export type RootContainerProps = {};

const Root: React.FC<RootContainerProps> = (props) => (
  <Provider store={store}>
    <PopupLayoutProvider>
      <Router>
        <RootContainer />
      </Router>
    </PopupLayoutProvider>
  </Provider>
);

export default Root;
