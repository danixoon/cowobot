import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";
import AuthPopup from "../layout/AuthPopup";

const mapStateToProps = (state: RootState) => ({
  isAuth: state.user.status === "success",
  status: state.user.status,
  error: state.user.error?.message ?? "",
});
const mapDispatchToProps = {
  login: getActionCreator(ActionTypes.USER_LOGIN),
};

export const authPopupEnchancer = connect(mapStateToProps, mapDispatchToProps);

export default authPopupEnchancer(AuthPopup);
