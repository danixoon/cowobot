import * as React from "react";
import { connect } from "react-redux";
import { store, RootState } from "../redux/store";
import PopupLayout from "../layout/PopupLayout";

const mapStateToProps = (state: RootState) => ({ popup: state.popup });
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PopupLayout);
