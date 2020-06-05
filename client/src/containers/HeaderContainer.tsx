import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";
import ControlPanel from "../components/ControlPanel";
import Layout from "../components/Layout";
import AccountPanel from "../components/AccountPanel";
import HeaderPanel, { HeaderPanelProps } from "../layout/HeaderPanel";

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});
const mapDispatchToProps = {
  logout: getActionCreator(ActionTypes.USER_LOGOUT),
};

export const headerEnchancer = connect(mapStateToProps, mapDispatchToProps);
export default headerEnchancer(HeaderPanel);
