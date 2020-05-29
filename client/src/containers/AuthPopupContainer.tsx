import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";
import AuthPopup from "../layout/AuthPopup";
import { userLogin } from "../redux/actions";

const mapStateToProps = (state: RootState) => ({
  isAuth: state.user.status === "success",
  status: state.user.status,
  error: state.user.error?.message ?? "",
});
const mapDispatchToProps = {
  login: userLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPopup);
