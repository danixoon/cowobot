import * as React from "react";
import { v4 as uuid } from "uuid";
import { ConnectedProps } from "react-redux";
import Layout from "../../components/Layout";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";
import StatusSwitcher from "../../components/StatusSwitcher";
import Button from "../../components/Button";
import { useInput } from "../../hooks/useInput";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { NoticeState, QueryRole } from "../../redux/types";
import Section from "../../components/Section";
import TextArea from "../../components/TextArea";
import Dropdown from "../../components/Dropdown";
import LoadingBanner from "../../components/LoadingBanner";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";

export const Notice: React.FC<{
  notice: ArrayElement<NoticeState["notices"]>;
  service: IServiceWithAction;
  onNoticeSave: (noticeId: number, data: ISavedNotice) => void;
  onNoticeDelete: (noticeId: number) => void;
}> = (props) => {
  const { notice, service, onNoticeSave, onNoticeDelete } = props;
  const queriesBind = useInput();
  const valuesBind = useInput();
  const messageBind = useInput({ messageTemplate: notice.messageTemplate });
  const [target, setTargetData] = React.useState(() => ({
    actionId: notice.actionId,
    targetKey: notice.targetKey,
  }));
  const [deletePopup, toggleDeletePopup] = React.useState(() => false);

  React.useEffect(() => {
    const input = notice.queries.reduce(
      (acc, query) => ({ ...acc, [query.key]: query.customKey || query.key }),
      {}
    );
    queriesBind.setInput(input);
  }, [notice.queries]);

  React.useEffect(() => {
    valuesBind.setInput(
      notice.values.reduce(
        (acc, value) => ({ ...acc, [value.key]: value.value }),
        {}
      )
    );
  }, [notice.values]);

  React.useEffect(() => {
    // handleNoticeSave();
    setTargetData({
      ...target,
      actionId: notice.actionId,
      targetKey: notice.targetKey,
    });
  }, [notice.actionId, notice.targetKey]);

  const handleNoticeSave = () => {
    const data: ISavedNotice = {
      actionId: target.actionId,
      queries: Object.entries(queriesBind.input).map(([key, value]) => ({
        key,
        customKey: value as string,
      })),
      values: Object.entries(valuesBind.input).map(([key, value]) => ({
        key,
        value: value as string,
      })),
      messageTemplate: messageBind.input.messageTemplate,
      targetKey: target.targetKey,
    };

    onNoticeSave(notice.id, data);
  };

  const handleActionSelect = (key: string) => {
    const action = service.actions.find(
      (action) => action.key === key
    ) as IAction;

    target.actionId = action.id;
    setTargetData({ ...target, actionId: action.id });
    handleNoticeSave();

    // onNoticeActionChange(notice.id, action.id);
    // // handleNoticeSave();
  };

  const handleTargetSelect = (key: any) => {
    setTargetData({ ...target, targetKey: key });
  };

  const handleNoticeDelete = () => {
    onNoticeDelete(notice.id);
  };

  return (
    <div style={{ position: "relative" }}>
      <LoadingBanner isLoading={notice.action != null} />
      <Layout
        direction="column"
        style={{
          flex: 1,
          borderBottom: "2px solid white",
        }}
      >
        <Section
          style={{ padding: "0.5 0.5rem" }}
          header={`Оповещение #${notice.id}`}
        >
          <Layout direction="column">
            <Layout direction="row">
              <Section
                style={{ flex: 1, paddingLeft: 0, paddingRight: 0 }}
                header="Параметры отправки"
              >
                {notice.values.map((value) => (
                  <Label text={value.name} key={value.key}>
                    <Input {...valuesBind} name={value.key} />
                  </Label>
                ))}
              </Section>
              <Section
                style={{ flex: 1, paddingLeft: 0, paddingRight: 0 }}
                header="Данные оповещения"
              >
                {notice.queries.map((query) => (
                  <Label text={query.name} key={query.key}>
                    <Input {...queriesBind} name={query.key} />
                  </Label>
                ))}
              </Section>
            </Layout>
            <Layout direction="row">
              <Layout direction="column">
                <Label text="Событие">
                  <Dropdown
                    items={service.actions}
                    onItemSelect={handleActionSelect}
                    selectedKey={
                      service.actions.find(
                        (action) => action.id === target.actionId
                      )?.key
                    }
                  />
                </Label>
                <Label text="Получатель">
                  <Dropdown
                    onItemSelect={handleTargetSelect}
                    selectedKey={target.targetKey}
                    items={[
                      { name: "По значению", key: null },
                      ...notice.queries.filter((query) => {
                        // console.log(query);
                        const access =
                          (QueryRole.Messenger & query.role) === query.role;
                        return access;
                      }),
                    ]}
                  />
                </Label>
                <DialogPopup opened={deletePopup}>
                  <Section style={{ textAlign: "center" }} header="Внимание">
                    <Form
                      onReset={() => toggleDeletePopup(false)}
                      onSubmit={() => {
                        toggleDeletePopup(false);
                        handleNoticeDelete();
                      }}
                    >
                      <p> Вы уверены, что хотите удалить оповещение? </p>
                      <Layout direction="row">
                        <Button type="reset"> Нет </Button>
                        <Button type="submit"> Да </Button>
                      </Layout>
                    </Form>
                  </Section>
                </DialogPopup>
                <Button
                  onClick={() => toggleDeletePopup(true)}
                  style={{ marginTop: "auto" }}
                  size="sm"
                >
                  Удалить
                </Button>
              </Layout>
              <Layout direction="column" style={{ flex: 1 }}>
                <Label text="Щаблон оповещения">
                  <TextArea
                    style={{ height: "150px" }}
                    tokens={Object.entries(queriesBind.input).map(
                      ([key, value]: any) => ({
                        key,
                        name: value,
                      })
                    )}
                    onChange={(value) =>
                      messageBind.setInput({
                        ...messageBind.input,
                        messageTemplate: value,
                      })
                    }
                    value={messageBind.input.messageTemplate}
                  />
                </Label>
              </Layout>
            </Layout>
          </Layout>
          <Layout direction="row" style={{ justifyContent: "flex-end" }}>
            <Button>Тест</Button>
            <Button onClick={handleNoticeSave}>Сохранить</Button>
          </Layout>
        </Section>
      </Layout>
    </div>
  );
};
