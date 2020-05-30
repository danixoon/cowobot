import * as React from "react";
import "./styles.scss";
import { mergeProps } from "../../utils";
import Button from "../Button";

interface AccountPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  avatarUrl: string;
  logout: () => void;
}

const AccountPanel: React.FC<React.PropsWithChildren<AccountPanelProps>> = (
  props: AccountPanelProps
) => {
  const { username, avatarUrl, logout, ...rest } = props;
  const mergedProps = mergeProps({ className: "account-panel" }, rest);

  return (
    <div {...mergedProps}>
      <header className="account-panel__username"> {username} </header>
      <Button size="sm" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
};

export default AccountPanel;
