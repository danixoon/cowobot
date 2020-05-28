import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.scss";
import { PopupLayoutContext } from "../../providers/PopupLayoutProvider";
import PopupProvider from "../../providers/PopupProvider";

interface DialogPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit?: () => void;
  onReset?: () => void;
  opened?: boolean;
}

const DialogPopup: React.FC<React.PropsWithChildren<DialogPopupProps>> = (
  props: DialogPopupProps
) => {
  const { children, onSubmit, onReset, opened } = props;
  const child = React.Children.only(children);
  return (
    <PopupProvider>
      <div
        className={`dialog-popup ${
          opened ? "dialog-popup_opened" : "dialog-popup_closed"
        }`}
      >
        <div onClick={onReset} className="dialog-popup__background" />
        <div className="dialog-popup__content">
          {child &&
            React.cloneElement(child as React.ReactElement, {
              onSubmit,
              onReset,
            })}
        </div>
      </div>
    </PopupProvider>
  );
};

export default DialogPopup;
