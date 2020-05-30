import * as React from "react";
import Layout from "../../components/Layout";
import ControlPanel from "../../components/ControlPanel";
import AccountPanel from "../../components/AccountPanel";

export interface HeaderPanelProps {
  user: { username: string; avatarUrl: string };
  logout: () => void;
}

const HeaderPanel: React.FC<HeaderPanelProps> = (props) => {
  const { user, logout } = props;
  return (
    <Layout mb bg direction="row" style={{ flexBasis: "50px" }}>
      <ControlPanel style={{ flex: 1 }} />
      <AccountPanel
        logout={logout}
        style={{ width: "220px" }}
        username={user.username}
        avatarUrl={user.avatarUrl}
      />
    </Layout>
  );
};

export default HeaderPanel;
