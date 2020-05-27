import * as React from "react";
import { RootState } from "../redux/types";
import { connect } from "react-redux";
import ControlPanel from "../components/ControlPanel";
import ContainerLayout from "../layout/ContainerLayout";
import AccountPanel from "../components/AccountPanel";

interface HeaderContainerProps {}

const HeaderContainer: React.FC<HeaderContainerProps> = (props) => {
  const user = { username: "danixoon", avatarUrl: "" };
  return (
    <ContainerLayout direction="row" style={{ flexBasis: "50px" }}>
      <ControlPanel style={{ flex: 1 }} />
      <AccountPanel
        style={{ width: "220px" }}
        username={user.username}
        avatarUrl={user.avatarUrl}
      />
    </ContainerLayout>
  );
};

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
