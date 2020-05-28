import * as React from "react";
import { RootState } from "../redux/types";
import RootLayout, { RootLayoutProps } from "../layout/RootLayout";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
  login: state.user.login,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RootLayout);
