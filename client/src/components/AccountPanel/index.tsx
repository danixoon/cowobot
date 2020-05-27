import * as React from "react";
import "./styles.scss";
import { mergeProps } from "../../utils";

interface AccountPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  avatarUrl: string;
}

const AccountPanel: React.FC<React.PropsWithChildren<AccountPanelProps>> = (
  props: AccountPanelProps
) => {
  const { username, avatarUrl, ...rest } = props;
  const mergedProps = mergeProps({ className: "account-panel" }, rest);

  return (
    <div {...mergedProps}>
      <header className="account-panel__username"> {username} </header>
      <img className="account-panel__avatar" src={avatarUrl} />
    </div>
  );
};

export default AccountPanel;
