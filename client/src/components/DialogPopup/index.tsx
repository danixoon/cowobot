import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.scss";
import { PopupLayoutContext } from "../../containers/PopupLayoutContainer";
import PopupContainer from "../../containers/PopupContainer";

interface DialogPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: () => void;
  onAbort: () => void;
}

const DialogPopup: React.FC<React.PropsWithChildren<DialogPopupProps>> = (
  props: DialogPopupProps
) => {
  const { children } = props;
  return (
    <PopupContainer>
      <div className="dialog-popup">{children}</div>
    </PopupContainer>
  );
};

export default DialogPopup;
