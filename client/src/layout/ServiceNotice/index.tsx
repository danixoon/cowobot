import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import Section from "../../components/Section";
import Dropdown from "../../components/Dropdown";
import { DataStatus } from "../../redux/types";

export type ServiceNoticeProps = {
  variables: {
    name: string;
    defaultValue: string;
    isTarget: boolean;
  }[];
  notices: { id: string; name: string }[];
  status: DataStatus;
};

const ServiceNoticeProps: React.FC<ServiceNoticeProps> = (props) => {
  const { variables, notices, status } = props;

  return (
    <>
      {status === "success" && (
        <Section header="Действия">
          <Dropdown items={notices.map((v) => v.name)} />
        </Section>
      )}
    </>
  );
};

export default ServiceNoticeProps;
