import * as React from "react";
import { RootState, getActionCreator, ActionTypes } from "../redux/types";
import { connect } from "react-redux";

import ServicesTree, { ServicesTreeProps } from "../layout/ServicesTree";

const mapStateToProps = (state: RootState) => ({
  services: state.service.services.data ?? [],
  selectedServiceId: state.service.serviceId,
});
const mapDispatchToProps = {
  onServiceSelect: getActionCreator(ActionTypes.SERVICE_SELECT),
};

export const servicesTreeEnchancer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default servicesTreeEnchancer(ServicesTree);
