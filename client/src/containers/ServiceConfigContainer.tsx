import * as React from "react";
import { RootState, DataStatus } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState): ServiceConfigProps => ({
  config: state.service.config.data,
  status: state.service.config.status,
  service:
    state.service.services.data?.find(
      (d) => d.id === state.service.serviceId
    ) || null,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceConfig);
