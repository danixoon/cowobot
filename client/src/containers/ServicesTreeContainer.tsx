import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";

import ServicesTree, { ServicesTreeProps } from "../layout/ServicesTree";
import { serviceSelect } from "../redux/actions";

const mapStateToProps = (state: RootState) => ({
  services: state.service.data.services,
  selectedServiceId:
    state.service.data.selectedServiceConfig?.serviceId ?? null,
});
const mapDispatchToProps = {
  onServiceSelect: serviceSelect,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesTree);
