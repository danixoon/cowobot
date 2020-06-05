import * as React from "react";
import { ConnectedProps } from "react-redux";
import Layout from "../../components/Layout";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";

const ServiceConfig: React.FC<ConnectedProps<typeof serviceConfigEnchancer>> = (
  props
) => {
  return <Layout direction="column"></Layout>;
};

export default ServiceConfig;
