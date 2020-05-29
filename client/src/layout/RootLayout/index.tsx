import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ContainerLayout from "../ContainerLayout";
import HeaderContainer from "../../containers/HeaderContainer";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";
import AuthPopupContainer from "../../containers/AuthPopupContainer";

export interface RootLayoutProps {
  isAuth: boolean;
}

const RootLayout: React.FC<RootLayoutProps> = (props) => {
  const { isAuth } = props;
  return (
    <>
      <ContainerLayout style={{ height: "100vh" }} direction="column">
        <AuthPopupContainer />
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
