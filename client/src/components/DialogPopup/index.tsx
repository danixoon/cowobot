import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.scss";
import { PopupLayoutContext } from "../../providers/PopupLayoutProvider";
import PopupProvider from "../../providers/PopupProvider";

interface DialogPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: () => void;
  onAbort: () => void;
}

const DialogPopup: React.FC<React.PropsWithChildren<DialogPopupProps>> = (
  props: DialogPopupProps
) => {
  const { children } = props;
  return (
    <PopupProvider>
      <div className="dialog-popup">{children}</div>
    </PopupProvider>
  );
};

export default DialogPopup;
