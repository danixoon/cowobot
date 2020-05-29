import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Layout from "../../components/Layout";
import HeaderContainer from "../../containers/HeaderContainer";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";
import AuthPopupContainer from "../../containers/AuthPopupContainer";
import ServicesTreeContainer from "../../containers/ServicesTreeContainer";

export interface RootLayoutProps {
  isAuth: boolean;
}

const RootLayout: React.FC<RootLayoutProps> = (props) => {
  const { isAuth } = props;
  return (
    <>
      <Layout style={{ height: "100vh" }} direction="column">
        <AuthPopupContainer />
        <HeaderContainer />
        <Layout direction="row" style={{ flex: "1" }}>
          <Layout bg mr direction="column" style={{ flexBasis: "200px" }}>
            <ServicesTreeContainer />
          </Layout>
          <Layout bg direction="column" style={{ flex: "1" }}>
            
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default RootLayout;
