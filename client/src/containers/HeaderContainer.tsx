import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";
import ControlPanel from "../components/ControlPanel";
import Layout from "../components/Layout";
import AccountPanel from "../components/AccountPanel";
import HeaderPanel, { HeaderPanelProps } from "../layout/HeaderPanel";
import { userLogout } from "../redux/actions";

const mapStateToProps = (state: RootState) => ({
  user: state.user.data,
});
const mapDispatchToProps = {
  logout: userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPanel);
