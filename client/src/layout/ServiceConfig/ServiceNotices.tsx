import * as React from "react";
import Section from "../../components/Section";
import Layout from "../../components/Layout";
import Label from "../../components/Label";
import Input from "../../components/Input";
import ServiceNotice, { Notice } from "./ServiceNotice";
import Button from "../../components/Button";
import { ServiceState } from "../../redux/types";
import { InputHook } from "../../hooks/useInput";

export type ServiceNoticesProps = {
  config: NonNullable<ServiceState["config"]["data"]>;
  bindVariablesInput: InputHook<any>;
  localNotices: Notice[];
  variableChanges: any;

  handleDeleteNotice: (notice: Notice) => void;
  handleChangeNotice: (notice: Notice, changes: Partial<Notice>) => void;
  handleAddNotice: () => void;
  handleSaveConfig: () => void;
  handleDeleteConfig: (configId: number) => void;
};

const ServiceNotices: React.FC<ServiceNoticesProps> = (props) => {
  const {
    config,
    bindVariablesInput,
    localNotices,
    variableChanges,
    handleDeleteNotice,
    handleChangeNotice,
    handleAddNotice,
    handleSaveConfig,
    handleDeleteConfig,
  } = props;
  return (
    <>
      <Section header="Переменные">
        <Layout direction="column">
          {config.variables.map((v) => (
            <Label key={v.variableId} text={v.name}>
              <Input
                {...bindVariablesInput}
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
          <Button onClick={() => config && handleDeleteConfig(config.configId)}>
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
    </>
  );
};

export default ServiceNotices;
