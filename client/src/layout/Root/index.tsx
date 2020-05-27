import * as React from "react";
import ContainerLayout from "../ContainerLayout";
import HeaderContainer from "../../containers/HeaderContainer";

interface RootProps {}

const Root: React.FC<RootProps> = (props) => {
  return (
    <>
      <ContainerLayout style={{ height: "100vh" }} direction="column">
        <HeaderContainer />
        <ContainerLayout
          direction="column"
          style={{ flex: "1" }}
        >
          
        </ContainerLayout>
      </ContainerLayout>
    </>
  );
};

export default Root;
