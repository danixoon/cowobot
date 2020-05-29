import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";

import ServicesTree, { ServicesTreeProps } from "../layout/ServicesTree";

const mapStateToProps = (state: RootState): ServicesTreeProps => ({
  services: state.service.data.services,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServicesTree);
