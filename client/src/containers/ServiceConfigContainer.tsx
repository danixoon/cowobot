import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState) => ({
  config: state.config,
  serviceView: state.service.serviceView,
  service: state.service.services.find(
    (service) => service.id === state.config.serviceId
  ),
});
const mapDispatchToProps = {
  createConfig: getActionCreator(ActionTypes.CONFIG_CREATE),
  deleteConfig: getActionCreator(ActionTypes.CONFIG_DELETE),
  udateConfig: getActionCreator(ActionTypes.CONFIG_UPDATE),
};

export const serviceConfigEnchancer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default serviceConfigEnchancer(ServiceConfig);
