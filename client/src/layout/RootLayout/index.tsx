import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ContainerLayout from "../ContainerLayout";
import HeaderContainer from "../../containers/HeaderContainer";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";

export interface RootLayoutProps {
  login: boolean;
}

const RootLayout: React.FC<RootLayoutProps> = (props) => {
  const { login } = props;
  return (
    <>
      <ContainerLayout style={{ height: "100vh" }} direction="column">
        <DialogPopup opened={!login}>
          <Form>
            <p> Войдите в аккаунт </p>
          </Form>
        </DialogPopup>
        <HeaderContainer />
        <ContainerLayout
          direction="column"
          style={{ flex: "1" }}
        ></ContainerLayout>
      </ContainerLayout>
    </>
  );
};

export default RootLayout;
