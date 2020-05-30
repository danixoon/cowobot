import * as React from "react";
import { RootState, DataStatus } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState): ServiceConfigProps => ({
  actions: state.service.config.data?.actions ?? [],
  variables: state.service.config.data?.variables ?? [],
  status: state.service.config.status,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceConfig);
