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
import ServiceNotice, { UnsavedNotice, Notice } from "./ServiceNotice";

export type ServiceConfigProps = {
  config: ServiceState["config"]["data"];
  service: null | ArrayElement<NonNullable<ServiceState["services"]["data"]>>;
  status: DataStatus;
  createConfig: (serviceId: number) => void;
  deleteConfig: (configId: number) => void;
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const { config, status, service, createConfig, deleteConfig } = props;
  const [changes, bind, setChanges] = useInput({});
  const [unsavedNotices, setUnsavedNotices] = React.useState<UnsavedNotice[]>(
    () => []
  );

  React.useEffect(() => {
    if (config)
      setChanges(
        config.variables.reduce(
          (c, v) => ({ ...c, [v.variableId]: v.defaultKey }),
          {}
        )
      );
    else {
      console.log("notices cleared");
      setUnsavedNotices([]);
    }
  }, [config]);

  const handleCreateConfig = () => {
    if (service) createConfig(service?.serviceId);
  };

  const handleAddNotice = () => {
    if (!config) return alert("Конфигурация не загружена.");
    const target = config.variables.find((v) => v.isTarget);
    if (!target)
      return alert(
        "У выбранного сервиса отсутствуют возможные переменные получателей"
      );
    const notices = [
      ...unsavedNotices,
      {
        actionId: config.actions[0].actionId,
        messageTemplate: `Привет, \${${target.customKey || target.defaultKey}}`,
        variableId: target.variableId,
        localId: uuid(),
        noticeId: null,
      },
    ];

    setUnsavedNotices(notices);
  };

  const handleDeleteNotice = (notice: Notice | UnsavedNotice) => {
    // Проверка на локальные изменения
    if ((notice as UnsavedNotice).localId) {
      const filtered = unsavedNotices.filter(
        (n) => n.localId !== (notice as UnsavedNotice).localId
      );
      setUnsavedNotices(filtered);
    } else {
      // TODO удаление с сервера
    }
  };

  const handleChangeNotice = (
    notice: Notice | UnsavedNotice,
    changes: Partial<Notice | UnsavedNotice>
  ) => {
    if ((notice as UnsavedNotice).localId) {
      const localId = (notice as UnsavedNotice).localId;
      const modified = unsavedNotices.map((v) =>
        v.localId === localId ? { ...v, ...changes } : v
      );
      setUnsavedNotices(modified);
    }
  };

  const handleApplyChanges = () => {};

  return (
    <>
      {status === "success" &&
        (config !== null ? (
          <Layout style={{ height: "100%" }} direction="column">
            <Section header="Переменные">
              <Layout direction="column">
                {config.variables.map((v) => (
                  <Label key={v.variableId} text={v.name}>
                    <Input
                      input={changes}
                      setInput={setChanges}
                      {...bind}
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
                {[
                  ...unsavedNotices,
                  ...config.notices.filter((notice) =>
                    unsavedNotices.find((n) => n.noticeId !== notice.noticeId)
                  ),
                ].map((notice) => (
                  <ServiceNotice
                    key={
                      (notice as Notice).noticeId ||
                      (notice as UnsavedNotice).localId
                    }
                    variables={config.variables.filter((v) => v.isTarget)}
                    actions={config.actions}
                    notice={notice}
                    onDelete={handleDeleteNotice}
                    onChange={(changes) => handleChangeNotice(notice, changes)}
                  />
                ))}
              </Layout>
              <Button onClick={handleAddNotice} style={{ width: "100%" }}>
                Добавить рассылку
              </Button>
            </Section>
            <Section style={{ marginTop: "auto" }} header="Действия">
              <Layout direction="row">
                <Button onClick={() => config && deleteConfig(config.configId)}>
                  Удалить конфигурацию
                </Button>
                <Button
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  Тест
                </Button>
                <Button color="primary">Сохранить</Button>
              </Layout>
            </Section>
          </Layout>
        ) : (
          <Layout
            direction="column"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <p style={{ textAlign: "center" }}>
              Бот отсутствует для сервиса "{service?.name}" <br />
              Вы можете создать его.
            </p>
            <Button onClick={handleCreateConfig}>Создать бота</Button>
          </Layout>
        ))}
    </>
  );
};

export default ServiceConfig;
