import * as React from "react";
import { RootState, DataStatus } from "../redux/types";
import { connect } from "react-redux";
import ServiceNotice, { ServiceNoticeProps } from "../layout/ServiceNotice";

const mapStateToProps = (state: RootState): ServiceNoticeProps => ({
  notices: state.service.data.selectedService?.notices ?? [],
  variables: state.service.data.selectedService?.variables ?? [],
  status: state.service.data.selectedService ? "success" : "idle",
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceNotice);
