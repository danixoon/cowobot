import * as React from "react";
import { RootState } from "../redux/types";
import RootLayout, { RootLayoutProps } from "../layout/RootLayout";
import { connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
  isAuth: state.user.status === "success",
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RootLayout);
