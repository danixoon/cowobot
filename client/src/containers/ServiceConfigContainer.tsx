import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";
import {
  configCreate,
  configDelete,
  configSaveSuccess,
  configSave,
} from "../redux/actions";

const mapStateToProps = (state: RootState) => ({
  config: state.service.config.data,
  status: state.service.config.status,
  service:
    state.service.services.data?.find(
      (d) => d.serviceId === state.service.serviceId
    ) || null,
});
const mapDispatchToProps = {
  createConfig: configCreate,
  deleteConfig: configDelete,
  saveConfig: configSave,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceConfig);
