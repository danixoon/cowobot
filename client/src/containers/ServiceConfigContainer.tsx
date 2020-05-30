import * as React from "react";
import { RootState, DataStatus } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";
import { configCreate, configDelete } from "../redux/actions";

const mapStateToProps = (state: RootState) => ({
  config: state.service.config.data,
  status: state.service.config.status,
  service:
    state.service.services.data?.find(
      (d) => d.id === state.service.serviceId
    ) || null,
});
const mapDispatchToProps = {
  createConfig: configCreate,
  deleteConfig: configDelete,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceConfig);
