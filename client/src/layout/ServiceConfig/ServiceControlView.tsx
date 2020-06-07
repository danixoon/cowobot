import * as React from "react";
import { v4 as uuid } from "uuid";
import { ConnectedProps } from "react-redux";
import Layout from "../../components/Layout";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";
import StatusSwitcher from "../../components/StatusSwitcher";
import Button from "../../components/Button";
import { useInput } from "../../hooks/useInput";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { NoticeState, QueryRole } from "../../redux/types";
import Section from "../../components/Section";
import TextArea from "../../components/TextArea";
import Dropdown from "../../components/Dropdown";
import LoadingBanner from "../../components/LoadingBanner";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";
import { ServiceConfigProps } from ".";
import { Notice } from "./Notice";

export const ServiceControlView: React.FC<ServiceConfigProps> = (props) => {
  const { notice, config, service, deleteConfig, updateConfig } = props;

  //   let status = "idle";

  //   if (isEmpty) status = "empty";
  //   if (config.action === "fetch") status = "loading";
  //   if (error) status = "error";
  //   if (config.id) status = "success";

  const controlBind = useInput({ token: config.token });

  const selectedService = service.services.find(
    (s) => s.id === service.serviceId
  ) as IServiceWithAction;

  const handleTokenSave = () => {
    updateConfig({ configId: config.id, token: controlBind.input.token });
  };

  const handleConfigDelete = () => {
    deleteConfig({ configId: config.id });
  };

  return (
    <>
      <Section
        header="Управление конфигурацией"
        style={{ position: "relative" }}
      >
        <LoadingBanner isLoading={config.action !== null} />
        <Layout direction="row">
          <Layout style={{ flex: 1 }} direction="column">
            <Label text="Ключ доступа">
              <Input {...controlBind} name="token" />
            </Label>
          </Layout>
          <Layout direction="column">
            <Label
              style={{ display: "flex", flexFlow: "column" }}
              text="Действия"
            >
              <Button onClick={handleTokenSave}> Сохранить </Button>
              <Button onClick={handleConfigDelete} size="sm">
                Удалить конфигурацию
              </Button>
            </Label>
          </Layout>
        </Layout>
      </Section>
    </>
  );
};
