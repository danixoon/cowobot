import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";
import ControlPanel from "../components/ControlPanel";
import ContainerLayout from "../layout/ContainerLayout";
import AccountPanel from "../components/AccountPanel";
import HeaderPanel, { HeaderPanelProps } from "../layout/HeaderPanel";

const mapStateToProps = (state: RootState): HeaderPanelProps => ({
  user: state.user.data,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPanel);
