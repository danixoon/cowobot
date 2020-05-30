import * as React from "react";
import { RootState, DataStatus } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState): ServiceConfigProps => ({
  actions: state.service.data.selectedServiceConfig?.actions ?? [],
  variables: state.service.data.selectedServiceConfig?.variables ?? [],
  status: state.service.data.selectedServiceConfig ? "success" : "idle",
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceConfig);
