import * as React from "react";
import { ConnectedProps } from "react-redux";
import Layout from "../../components/Layout";
import { serviceConfigEnchancer } from "../../containers/ServiceConfigContainer";
import StatusSwitcher from "../../components/StatusSwitcher";
import Button from "../../components/Button";
import { useInput } from "../../hooks/useInput";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { NoticeState } from "../../redux/types";
import Section from "../../components/Section";
import TextArea from "../../components/TextArea";
import Dropdown from "../../components/Dropdown";

type ServiceConfigProps = ConnectedProps<typeof serviceConfigEnchancer>;

const ConfigMessage: React.FC<{}> = (props) => {
  const { children } = props;
  return (
    <Layout direction="column" style={{ textAlign: "center", margin: "auto" }}>
      {children}
    </Layout>
  );
};

const CreateConfigDialog: React.FC<{
  onCreateConfig: () => void;
}> = ({ onCreateConfig }) => {
  return (
    <ConfigMessage>
      У вас отсутствует конфигурация. <br /> Вы можете создать её
      <Button onClick={onCreateConfig} style={{ marginTop: "2rem" }}>
        Создать
      </Button>
    </ConfigMessage>
  );
};

const ConfigErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <ConfigMessage>
      Произошла ошибка. <br /> {message}
    </ConfigMessage>
  );
};

const Notice: React.FC<{
  notice: ArrayElement<NoticeState["notices"]>;
}> = (props) => {
  const { notice } = props;
  const queriesBind = useInput();
  const valuesBind = useInput();
  const messageBind = useInput({ messageTemplate: notice.messageTemplate });

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

  return (
    <div>
      <Layout
        direction="column"
        style={{
          flex: 1,
          borderBottom: "2px solid white",
          // borderTop: "2px solid white",
        }}
      >
        <Section
          style={{ padding: "0.5 0.5rem" }}
          header={`Оповещение #${notice.id}`}
        >
          <Layout direction="column">
            <Label text="Событие">
              <Dropdown items={[{ key: "test", name: "Выбор аниме" }]} />
            </Label>
            <Layout direction="row">
              <Section style={{ flex: 1 }} header="Значения">
                {notice.values.map((value) => (
                  <Label text={value.name} key={value.key}>
                    <Input {...valuesBind} name={value.key} />
                  </Label>
                ))}
              </Section>
              <Section style={{ flex: 1 }} header="Параметры">
                {notice.queries.map((query) => (
                  <Label text={query.name} key={query.key}>
                    <Input {...queriesBind} name={query.key} />
                  </Label>
                ))}
              </Section>
            </Layout>
          </Layout>
          <Section header="Шаблон оповещения">
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
            <Layout direction="row" style={{ justifyContent: "flex-end" }}>
              <Button>Тест</Button>
              <Button>Сохранить</Button>
            </Layout>
          </Section>
        </Section>
      </Layout>
    </div>
  );
};

const ConfigList: React.FC<{}> = (props) => {
  return <Layout direction="column">{props.children}</Layout>;
};

const ServiceConfig: React.FC<ServiceConfigProps> = (props) => {
  const { notice, config, service, createConfig } = props;
  const { isEmpty, error } = config;

  let status = "success";

  if (isEmpty) status = "empty";
  if (config.action === "fetch") status = "loading";
  if (error) status = "error";

  const handleCreateConfig = () => {
    createConfig({ serviceId: service.serviceId });
  };

  return (
    <>
      <StatusSwitcher
        status={status}
        empty={<CreateConfigDialog onCreateConfig={handleCreateConfig} />}
        error={<ConfigErrorMessage message={error?.message ?? ""} />}
        success={
          <ConfigList>
            {notice.notices.map((n) => (
              <Notice key={n.id} notice={n} />
            ))}
          </ConfigList>
        }
      />
    </>
  );
};

export default ServiceConfig;
