import * as React from "react";
import "../../sass/theme.scss";
import { testHello } from "../../redux/actions/popup";

export interface PopupLayoutProps {
  showMessage: (message: string) => void;
  message: string;
}

const PopupLayout: React.FC<React.PropsWithChildren<PopupLayoutProps>> = ({
  children,
  showMessage,
  message,
}) => {
  React.useEffect(() => {
    message !== "" && alert(message);
  }, [message]);
  return (
    <div className="popup-layout">
      {children} <button onClick={() => showMessage("Пупа")}> ЖМИ </button>
    </div>
  );
};

export default PopupLayout;
