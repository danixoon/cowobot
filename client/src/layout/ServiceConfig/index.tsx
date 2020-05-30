import * as React from "react";
import { v4 as uuid } from "uuid";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { DataStatus, ServiceState, ArrayElement } from "../../redux/types";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Label from "../../components/Label";
import TextArea from "../../components/TextArea";

type Notice = ArrayElement<
  NonNullable<ServiceConfigProps["config"]>["notices"]
>;
type UnsavedNotice = Omit<Notice, "id"> & {
  id: number | null;
  localId: string;
};

const ServiceNotice: React.FC<{
  notice: Notice | UnsavedNotice;
  actions: NonNullable<ServiceConfigProps["config"]>["actions"];
  variables: NonNullable<ServiceConfigProps["config"]>["variables"];
  onDelete: (notice: Notice | UnsavedNotice) => void;
  onChange: (changes: Partial<Notice | UnsavedNotice>) => void;
}> = ({ notice, actions, variables, onDelete, onChange }) => {
  const [updatedNotice, updateNotice] = React.useState<Partial<typeof notice>>(
    () => ({})
  );

  const handleOnChange = (updated: typeof updatedNotice) => {
    const nextNotice = { ...updatedNotice, ...updated };
    updateNotice(nextNotice);
    onChange(nextNotice);
  };

  return (
    <Layout style={{ padding: "1rem 0" }} direction="row">
      <Layout direction="column" style={{ flexBasis: "200px" }}>
        <Label text="Событие">
          <Dropdown
            defaultSelectedId={notice.actionId}
            onItemSelect={(actionId) => handleOnChange({ actionId })}
            items={actions.map((v) => ({ name: v.name, id: v.id }))}
          />
        </Label>
        <Label text="Получатель сообщения">
          <Dropdown
            onItemSelect={(variableId) => handleOnChange({ variableId })}
            defaultSelectedId={notice.variableId}
            items={variables.map((v) => ({
              id: v.id,
              name: v.customKey || v.defaultKey,
            }))}
          />
        </Label>
        <Button onClick={() => onDelete(notice)} size="sm">
          Удалить рассылку
        </Button>
      </Layout>
      <Layout direction="column" style={{ flex: 1 }}>
        <Label text="Шаблон сообщения">
          <TextArea
            variables={variables.map((v) => ({
              id: v.id,
              name: v.customKey || v.defaultKey,
            }))}
            value={notice.messageTemplate}
            onInputChange={(input) => {
              handleOnChange({ messageTemplate: input });
            }}
            style={{ minHeight: "150px" }}
          />
        </Label>
      </Layout>
    </Layout>
  );
};

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
        config.variables.reduce((c, v) => ({ ...c, [v.id]: v.defaultKey }), {})
      );
    else {
      setUnsavedNotices([]);
    }
  }, [config]);

  const handleCreateConfig = () => {
    if (service) createConfig(service?.id);
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
        actionId: config.actions[0].id,
        messageTemplate: `Привет, \${${target.customKey || target.defaultKey}}`,
        variableId: target.id,
        localId: uuid(),
        id: null,
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

  return (
    <>
      {status === "success" &&
        (config !== null ? (
          <Layout style={{ height: "100%" }} direction="column">
            <Section header="Переменные">
              <Layout direction="column">
                {config.variables.map((v) => (
                  <Label key={v.id} text={v.name}>
                    <Input
                      input={changes}
                      setInput={setChanges}
                      {...bind}
                      isResetable={true}
                      name={v.id.toString()}
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
                    unsavedNotices.find((n) => n.id !== notice.id)
                  ),
                ].map((notice) => (
                  <ServiceNotice
                    key={
                      (notice as Notice).id || (notice as UnsavedNotice).localId
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
