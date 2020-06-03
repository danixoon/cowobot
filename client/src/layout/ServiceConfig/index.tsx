import * as React from "react";
import { v4 as uuid } from "uuid";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { ServiceState } from "../../redux/types";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Label from "../../components/Label";
import TextArea from "../../components/TextArea";
import ServiceNotice, { Notice } from "./ServiceNotice";
import ServiceConnection from "./ServiceConnection";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";
import { ConnectedProps } from "react-redux";
import StatusSwitcher from "../../components/StatusSwitcher";
import ServiceNotices from "./ServiceNotices";

export type ServiceConfigProps = ConnectedProps<typeof serviceConfigEnchancer>;
const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const {
    config,
    status,
    service,
    createConfig,
    deleteConfig,
    saveConfig,
    serviceView,
  } = props;
  const bindVariablesInput = useInput({} as any);

  const {
    input: variableChanges,
    setInput: setVariableChanges,
  } = bindVariablesInput;

  const [localNotices, updateNotices] = React.useState<Notice[]>(() => []);

  React.useEffect(() => {
    if (config) {
      updateNotices(
        config.notices.map((notice) => ({
          ...notice,
          modified: null,
          localId: null,
        }))
      );
      setVariableChanges(
        config.variables.reduce(
          (c, v) => ({ ...c, [v.variableId]: v.customKey || v.defaultKey }),
          {}
        )
      );
    } else {
      console.log("notices cleared");
      updateNotices([]);
    }
  }, [config]);

  const handleCreateConfig = () => {
    if (service) createConfig({ serviceId: service?.serviceId });
  };

  const handleAddNotice = () => {
    if (!config) return alert("Конфигурация не загружена.");
    const target = config.variables.find((v) => v.isTarget);
    if (!target)
      return alert(
        "У выбранного сервиса отсутствуют возможные переменные получателей"
      );
    const notice: Notice = {
      actionId: config.actions[0].actionId,
      messageTemplate: `Привет, \${${target.customKey || target.defaultKey}}`,
      variableId: target.variableId,
      localId: uuid(),
      modified: "create",
      noticeId: 0,
    };

    const notices = [...localNotices, notice];
    updateNotices(notices);
  };

  const handleDeleteNotice = (notice: Notice) => {
    // Проверка на локальные изменения
    if (notice.localId) {
      const filtered = localNotices.filter((n) => n.localId !== notice.localId);
      updateNotices(filtered);
    } else {
      updateNotices(
        localNotices.map((n) =>
          n.noticeId !== notice.noticeId ? n : { ...n, modified: "delete" }
        )
      );
    }
  };

  const handleChangeNotice = (notice: Notice, changes: Partial<Notice>) => {
    const n = notice.localId
      ? localNotices.find((n) => n.localId === notice.localId)
      : localNotices.find((n) => n.noticeId === notice.noticeId);

    Object.assign(n, {
      ...changes,
      modified: notice.localId ? notice.modified : "update",
    });
    updateNotices(localNotices);
    // }
  };

  const handleSaveConfig = () => {
    if (!config) return;

    const notices = localNotices.filter(
      (notice) => typeof notice.modified === "string"
    ) as ApiRequestData.PUT["/service/config"]["changes"]["notices"];

    const variables = config.variables.map((v) => ({
      variableId: v.variableId,
      customKey: variableChanges[v.variableId] || null,
    }));

    saveConfig({
      configId: config.configId,
      changes: {
        notices,
        variables,
      },
    });
  };

  const handleDeleteConfig = (configId: number) => {
    deleteConfig({ configId });
  };

  const renderView = () => {
    return (
      <StatusSwitcher
        status={
          status === "success"
            ? config === null
              ? "createBot"
              : serviceView
            : status
        }
        idle={
          <Layout
            direction="column"
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            Добро пожаловать! Выберите сервис для конфигурирования
          </Layout>
        }
        connection={<ServiceConnection />}
        configuration={
          <ServiceNotices
            localNotices={localNotices}
            handleSaveConfig={handleSaveConfig}
            handleDeleteNotice={handleDeleteNotice}
            handleDeleteConfig={handleDeleteConfig}
            handleChangeNotice={handleChangeNotice}
            handleAddNotice={handleAddNotice}
            bindVariablesInput={bindVariablesInput}
            variableChanges={variableChanges}
            config={config as NonNullable<typeof config>}
          />
        }
        createBot={
          <Layout
            direction="column"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ textAlign: "center" }}>
              Бот отсутствует для сервиса "{service?.name}" <br />
              Вы можете создать его.
            </p>
            <Button onClick={handleCreateConfig}>Создать бота</Button>
          </Layout>
        }
      />
    );
  };

  return (
    <Layout style={{ height: "100%" }} direction="column">
      <StatusSwitcher status={status}>{renderView()}</StatusSwitcher>
    </Layout>
  );
};

export default ServiceConfig;
