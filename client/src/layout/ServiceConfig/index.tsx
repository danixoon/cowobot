import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { DataStatus } from "../../redux/types";

export type ServiceConfigProps = {
  variables: {
    defaultKey: string;
    customKey: string | null;
    isTarget: boolean;
  }[];
  actions: { id: number; name: string }[];
  status: DataStatus;
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const { variables, actions, status } = props;

  return (
    <>
      {status === "success" && (
        <Section header="Действия">
          <Dropdown items={actions.map((v) => v.name)} />
        </Section>
      )}
    </>
  );
};

export default ServiceConfig;
