import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { DataStatus } from "../../redux/types";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Label from "../../components/Label";

export type ServiceConfigProps = {
  config: null | {
    configId: number;
    variables: {
      id: number;
      name: string;
      defaultKey: string;
      customKey: string | null;
      isTarget: boolean;
    }[];
    actions: { id: number; name: string }[];
  };
  service: null | {
    name: string;
    id: number;
  };
  status: DataStatus;
  createConfig: (serviceId: number) => void;
  deleteConfig: (configId: number) => void;
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const { config, status, service, createConfig, deleteConfig } = props;
  const [changes, bind, setChanges] = useInput({});

  React.useEffect(() => {
    if (config)
      setChanges(
        config.variables.reduce((c, v) => ({ ...c, [v.id]: v.defaultKey }), {})
      );
  }, [config]);

  const handleCreateConfig = () => {
    if (service) createConfig(service?.id);
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
            <Section header="Рассылки">
              <Layout direction="row">
                <Label text="Действие">
                  <Dropdown items={config.actions.map((v) => v.name)} />
                </Label>
              </Layout>
            </Section>
            <Section style={{ marginTop: "auto" }} header="Действия">
              <Layout direction="row">
                <Button color="primary">Сохранить</Button>
                <Button>Тест</Button>
                <Button
                  onClick={() => config && deleteConfig(config.configId)}
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  Удалить конфигурацию
                </Button>
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
