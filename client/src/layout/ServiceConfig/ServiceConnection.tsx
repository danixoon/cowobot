import { ServiceConfigProps } from ".";
import React from "react";
import Layout from "../../components/Layout";
import Label from "../../components/Label";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";

const ServiceConnection: React.FC<{}> = ({}) => {
  const inputHook = useInput();
  return (
    <Layout style={{ padding: "1rem 0" }} direction="row">
      <Input {...inputHook} name="token" />
    </Layout>
  );
};

export default ServiceConnection;
