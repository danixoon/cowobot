import * as React from "react";
import Layout from "../../components/Layout";
import ControlPanel from "../../components/ControlPanel";
import AccountPanel from "../../components/AccountPanel";
import { ConnectedProps } from "react-redux";
import { headerEnchancer } from "../../containers/HeaderContainer";

export type HeaderPanelProps = {} & ConnectedProps<typeof headerEnchancer>;
const HeaderPanel: React.FC<HeaderPanelProps> = (props) => {
  const { user, logout } = props;
  return (
    <Layout mb bg direction="row" style={{ flexBasis: "50px" }}>
      <ControlPanel style={{ flex: 1 }} />
      <AccountPanel
        logout={logout}
        style={{ width: "220px" }}
        username={user.username}
        avatarUrl={""}
      />
    </Layout>
  );
};

export default HeaderPanel;
