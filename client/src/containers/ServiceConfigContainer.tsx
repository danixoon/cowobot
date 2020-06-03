import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig, { ServiceConfigProps } from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState) => ({
  config: state.service.config.data,
  status: state.service.config.status,
  serviceView: state.service.serviceView,
  service:
    state.service.services.data?.find(
      (d) => d.serviceId === state.service.serviceId
    ) || null,
});
const mapDispatchToProps = {
  createConfig: getActionCreator(ActionTypes.CONFIG_CREATE),
  deleteConfig: getActionCreator(ActionTypes.CONFIG_DELETE),
  saveConfig: getActionCreator(ActionTypes.CONFIG_SAVE),
};

export const serviceConfigEnchancer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default serviceConfigEnchancer(ServiceConfig);
