import { ServiceConfigProps } from ".";
import React from "react";
import Layout from "../../components/Layout";
import Label from "../../components/Label";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";

export interface Notice extends ApiResponseData.Service.Notice {
  noticeId: number;
  localId: string | null;
  modified: null | "delete" | "update" | "create";
}

const ServiceNotice: React.FC<{
  notice: Notice;
  actions: NonNullable<ServiceConfigProps["config"]>["actions"];
  variables: NonNullable<ServiceConfigProps["config"]>["variables"];
  onDelete: (notice: Notice) => void;
  onChange: (changes: Partial<Notice>) => void;
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
            items={actions.map((v) => ({ name: v.name, id: v.actionId }))}
          />
        </Label>
        <Label text="Получатель сообщения">
          <Dropdown
            onItemSelect={(variableId) => handleOnChange({ variableId })}
            defaultSelectedId={notice.variableId}
            items={variables.map((v) => ({
              id: v.variableId,
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
              id: v.variableId,
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

export default ServiceNotice;
