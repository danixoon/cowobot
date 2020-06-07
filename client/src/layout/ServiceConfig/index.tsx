import * as React from "react";
import { v4 as uuid } from "uuid";
import { ConnectedProps } from "react-redux";
import Layout from "../../components/Layout";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";
import StatusSwitcher from "../../components/StatusSwitcher";
import Button from "../../components/Button";
import { ServiceConfigView } from "./ServiceConfigView";
import { ServiceControlView } from "./ServiceControlView";

export type ServiceConfigProps = ConnectedProps<typeof serviceConfigEnchancer>;

export const ConfigMessage: React.FC<{}> = (props) => {
  const { children } = props;
  return (
    <Layout direction="column" style={{ textAlign: "center", margin: "auto" }}>
      {children}
    </Layout>
  );
};

export const CreateConfigDialog: React.FC<{
  onCreateConfig: () => void;
}> = ({ onCreateConfig }) => {
  return (
    <ConfigMessage>
      У вас отсутствует конфигурация. <br /> Вы можете создать её
      <Button onClick={onCreateConfig} style={{ marginTop: "2rem" }}>
        Создать
      </Button>
    </ConfigMessage>
  );
};

const ConfigErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <ConfigMessage>
      Произошла ошибка. <br /> {message}
    </ConfigMessage>
  );
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const {
    notice,
    config,
    service,
    createConfig,
    addNotice,
    saveNotice,
    deleteNotice,
  } = props;
  const { isEmpty, error } = config;

  const handleCreateConfig = () => {
    createConfig({ serviceId: service.serviceId });
  };

  let status = service.serviceView as string;
  if (!service.serviceId) status = "idle";
  if (isEmpty) status = "empty";
  if (error) status = "error";
  if (config.action) status = "loading";
  // if()

  return (
    <StatusSwitcher
      status={status}
      empty={<CreateConfigDialog onCreateConfig={handleCreateConfig} />}
      error={<ConfigErrorMessage message={error?.message ?? ""} />}
      config={<ServiceConfigView {...props} />}
      control={<ServiceControlView {...props} />}
    />
  );
};

export default ServiceConfig;
