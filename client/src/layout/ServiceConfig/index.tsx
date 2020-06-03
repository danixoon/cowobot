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
  const [variableChanges, bindVariables, setVariableChanges] = useInput(
    {} as any
  );
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

  const renderView = () => {
    switch (serviceView) {
      case "connection":
        return <ServiceConnection />;
      case "configuration":
        return (
          <>
            {status === "success" ? (
              config !== null ? (
                <Layout style={{ height: "100%" }} direction="column">
                  <Section header="Переменные">
                    <Layout direction="column">
                      {config.variables.map((v) => (
                        <Label key={v.variableId} text={v.name}>
                          <Input
                            input={variableChanges}
                            setInput={setVariableChanges}
                            {...bindVariables}
                            isResetable={true}
                            name={v.variableId.toString()}
                            defaultValue={v.defaultKey}
                          />
                        </Label>
                      ))}
                    </Layout>
                  </Section>
                  <Section header="Рассылки" style={{ flex: 1 }}>
                    <Layout direction="column">
                      {localNotices
                        .filter((notice) => notice.modified !== "delete")
                        .map((notice) => (
                          <ServiceNotice
                            key={notice.localId ?? notice.noticeId}
                            variables={config.variables
                              .filter((v) => v.isTarget)
                              .map((v) => ({
                                ...v,
                                customKey: variableChanges[v.variableId],
                              }))}
                            actions={config.actions}
                            notice={notice}
                            onDelete={handleDeleteNotice}
                            onChange={(changes) =>
                              handleChangeNotice(notice, changes)
                            }
                          />
                        ))}
                    </Layout>
                    <Button onClick={handleAddNotice} style={{ width: "100%" }}>
                      Добавить рассылку
                    </Button>
                  </Section>
                  <Section style={{ marginTop: "auto" }} header="Действия">
                    <Layout direction="row">
                      <Button
                        onClick={() =>
                          config && deleteConfig({ configId: config.configId })
                        }
                      >
                        Удалить конфигурацию
                      </Button>
                      <Button
                        style={{
                          marginLeft: "auto",
                        }}
                      >
                        Тест
                      </Button>
                      <Button onClick={handleSaveConfig} color="primary">
                        Сохранить
                      </Button>
                    </Layout>
                  </Section>
                </Layout>
              ) : (
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
              )
            ) : status === "idle" ? (
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
            ) : (
              <div>загрузка..</div>
            )}
          </>
        );
    }
  };

  return renderView();
};

export default ServiceConfig;
