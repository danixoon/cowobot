import * as React from "react";
import "../../sass/theme.scss";

interface PopupLayoutProps {}

const PopupLayout: React.FC<React.PropsWithChildren<PopupLayoutProps>> = ({
  children,
}) => {
  return <div className="popup-layout">{children}</div>;
};

export default PopupLayout;
