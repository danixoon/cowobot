import * as React from "react";
import {
  RootState,
  getActionCreator,
  ActionTypes,
  getAction,
} from "../redux/types";
import { connect } from "react-redux";
import ServiceConfig from "../layout/ServiceConfig";

const mapStateToProps = (state: RootState) => ({
  config: state.config,
  service: state.service,
  notice: state.notice,
});
const mapDispatchToProps = {
  createConfig: getActionCreator(ActionTypes.CONFIG_CREATE),
  deleteConfig: getActionCreator(ActionTypes.CONFIG_DELETE),
  updateConfig: getActionCreator(ActionTypes.CONFIG_UPDATE),
  addNotice: getActionCreator(ActionTypes.NOTICE_ADD),
  saveNotice: getActionCreator(ActionTypes.NOTICE_SAVE),
  deleteNotice: getActionCreator(ActionTypes.NOTICE_DELETE),
};

export const serviceConfigEnchancer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default serviceConfigEnchancer(ServiceConfig);
