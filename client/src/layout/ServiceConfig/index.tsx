import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { DataStatus } from "../../redux/types";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

export type ServiceConfigProps = {
  config: null | {
    variables: {
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
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const { config, status, service } = props;

  return (
    <>
      {status === "success" &&
        (config !== null ? (
          <Section header="Действия">
            <Dropdown items={config.actions.map((v) => v.name)} />
          </Section>
        ) : (
          <Layout
            direction="column"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <p style={{ textAlign: "center" }}>
              Бот отсутствует для сервиса "{service?.name}" <br />
              Вы можете создать его.
            </p>
            <Button> Создать бота </Button>
          </Layout>
        ))}
    </>
  );
};

export default ServiceConfig;
