import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";

import ServicesTree, { ServicesTreeProps } from "../layout/ServicesTree";

const mapStateToProps = (state: RootState) => ({
  service: state.service,
  config: state.config,
  // selectedServiceId: state.config.serviceId,
});
const mapDispatchToProps = {
  onServiceSelect: getActionCreator(ActionTypes.SERVICE_SELECT),
  onServiceViewSelect: getActionCreator(ActionTypes.SERVICE_VIEW_SELECT),
};

export const servicesTreeEnchancer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default servicesTreeEnchancer(ServicesTree);
