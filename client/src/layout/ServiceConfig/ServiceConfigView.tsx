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

const ConfigList: React.FC<{}> = (props) => {
  return <Layout direction="column">{props.children}</Layout>;
};

export const ServiceConfigView: React.FC<ServiceConfigProps> = (props) => {
  const {
    notice,
    config,
    service,

    addNotice,
    saveNotice,
    deleteNotice,
  } = props;

  //   let status = "idle";

  //   if (isEmpty) status = "empty";
  //   if (config.action === "fetch") status = "loading";
  //   if (error) status = "error";
  //   if (config.id) status = "success";

  const selectedService = service.services.find(
    (s) => s.id === service.serviceId
  ) as IServiceWithAction;

  const handleAddNotice = () => {
    addNotice({
      actionId: selectedService.actions[0].id,
      values: [],
      queries: [],
      randomId: uuid(),
      id: 0,
      configId: config.id,
      messageTemplate: "Отредактируй меня",
      serviceId: service.serviceId,
      targetKey: null,
    });
  };

  const handleSaveNotice = (noticeId: number, data: ISavedNotice) => {
    saveNotice({ ...data, noticeId, randomId: uuid() });
  };

  const handleDeleteNotice = (noticeId: number) => {
    deleteNotice({ noticeId });
  };

  return (
    <>
      <Layout direction="column">
        <ConfigList>
          {notice.notices.map((n) => (
            <Notice
              onNoticeSave={handleSaveNotice}
              onNoticeDelete={handleDeleteNotice}
              service={selectedService}
              key={n.id || n.randomId}
              notice={n}
            />
          ))}
        </ConfigList>
        <Button onClick={handleAddNotice}> Создать оповещение </Button>
      </Layout>
    </>
  );
};
