import * as React from "react";
import "./styles.scss";

type StatusSwitcherProps = {
  status: string;
  // [statusKey: string]: React.ReactElement | string;
} & any;

const StatusSwitcher: React.FC<StatusSwitcherProps> = (props) => {
  const { status, children, ...rest } = props;
  if (rest[status]) return rest[status];

  switch (status) {
    case "loading":
      return <div className="loader"></div>;
    case "error":
      return <div> Произошла ошибка. </div>;
    default:
      return children as React.ReactElement;
  }
};

export default StatusSwitcher;
