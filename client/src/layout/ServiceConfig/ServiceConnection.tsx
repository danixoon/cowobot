import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import Label from "../../components/Label";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Section from "../../components/Section";
import { RootState, getActionCreator, ActionTypes } from "../../redux/types";
import { connect, ConnectedProps } from "react-redux";

const ServiceConnection: React.FC<ConnectedProps<
  typeof serviceConnectionEnchancer
>> = (props) => {
  const inputHook = useInput({ token: props.token });
  useEffect(() => {
    if (inputHook.input.token != null)
      props.saveToken({ token: inputHook.input.token });
  }, [inputHook.input.token]);
  return (
    <Section header="Настройка подключения">
      <Layout direction="column">
        <Label text="Ключ доступа">
          <Input {...inputHook} name="token" />
        </Label>
      </Layout>
    </Section>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.service.config.data?.token,
});

const mapDispatchToProps = {
  saveToken: getActionCreator(ActionTypes.CONFIG_TOKEN_CHANGE),
};

const serviceConnectionEnchancer = connect(mapStateToProps, mapDispatchToProps);

export default serviceConnectionEnchancer(ServiceConnection);
