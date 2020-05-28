import * as React from "react";
import ContainerLayout from "../ContainerLayout";
import ControlPanel from "../../components/ControlPanel";
import AccountPanel from "../../components/AccountPanel";

export interface HeaderPanelProps {
  user: { username: string; avatarUrl: string };
}

const HeaderPanel: React.FC<HeaderPanelProps> = (props) => {
  const { user } = props;
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

export default HeaderPanel;
