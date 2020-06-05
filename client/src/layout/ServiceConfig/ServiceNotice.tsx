import { ServiceConfigProps } from ".";
import React from "react";
import Layout from "../../components/Layout";
import Label from "../../components/Label";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";

export interface Notice extends ApiResponseData.Service.Notice {
  noticeId: number;
  localId: string | null;
  variables: ApiResponseData.Service.Action["variables"];
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

  const selectedAction = actions.find((a) => notice.actionId === a.actionId);
  const inputData = selectedAction?.variables.reduce((input, v) => {
    input[v.variableId] = v.value;
    return input;
  }, {} as any);
  const bindActionVariables = useInput<any>(inputData);

  const handleOnChange = (updated: typeof updatedNotice) => {
    const nextNotice = { ...updatedNotice, ...updated };
    updateNotice(nextNotice);
    onChange(nextNotice);
  };

  // bindActionVariables

  React.useEffect(() => {
    const changes = Object.keys(bindActionVariables.input);
    const action = actions.find((a) => a.actionId === notice.actionId);
    if (!action) return;
    handleOnChange({
      variables: changes.map((variableId) => {
        const variable = action.variables.find(
          (v) => v.variableId === Number(variableId)
        );
        return {
          ...(variable as NonNullable<typeof variable>),
          value: bindActionVariables.input[variableId],
        };
      }),
    });
  }, [bindActionVariables.input]);

  return (
    <Layout style={{ padding: "1rem 0" }} direction="column">
      <Layout direction="row">
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
            items={variables
              .filter((v) => v.isTarget)
              .map((v) => ({
                id: v.variableId,
                name: v.customKey || v.defaultKey,
              }))}
          />
        </Label>
        <Button
          style={{ marginLeft: "auto" }}
          onClick={() => onDelete(notice)}
          size="sm"
        >
          Удалить рассылку
        </Button>
      </Layout>
      <Layout direction="row">
        <Layout direction="column">
          {selectedAction?.variables.map((v) => (
            <Label key={v.variableId || v.localId} text={v.name}>
              <Input
                {...bindActionVariables}
                // onChange={(input) => {
                //   bindActionVariables.onChange(input);
                //   const n = notice.noticeVariables.find(
                //     (n) => v.variableId === n.variableId
                //   );
                //   handleOnChange({
                //     noticeVariables: n
                //       ? [
                //           ...notice.noticeVariables.filter(
                //             (v) => v.variableId !== n.variableId
                //           ),
                //           { ...v, value: input.target.value },
                //         ]
                //       : [
                //           ...notice.noticeVariables,
                //           {
                //             ...v,
                //             value: input.target.value,
                //           },
                //         ],
                //   });
                // }}
                defaultValue={v.value || ""}
                name={v.variableId?.toString() || v.localId || ""}
              />
            </Label>
          ))}
        </Layout>
        <Label style={{ width: "100%" }} text="Шаблон сообщения">
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
