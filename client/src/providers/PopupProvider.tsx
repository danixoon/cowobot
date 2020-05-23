import * as React from "react";
import * as ReactDOM from "react-dom";
import { PopupLayoutContext } from "./PopupLayoutProvider";

export interface PopupContainerProps {}

const PopupProvider: React.FC<React.PropsWithChildren<PopupContainerProps>> = ({
  children,
}) => {
  return (
    <PopupLayoutContext.Consumer>
      {(ref) => {
        if (ref) return ReactDOM.createPortal(children, ref);
      }}
    </PopupLayoutContext.Consumer>
  );
};

export default PopupProvider;
