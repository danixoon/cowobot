import * as React from "react";
import { connect } from "react-redux";
import { RootState, mapState } from "../redux/types";
import { testHello } from "../redux/actions/popup";
import PopupLayout from "../layout/PopupLayout";

const mapStateToProps = (state: RootState) => ({
  message: state.test.message,
});

const mapDispatchToProps = {
  showMessage: testHello,
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupLayout);
