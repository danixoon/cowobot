import * as React from "react";
import * as ReactDOM from "react-dom";
import { PopupLayoutContext } from "./PopupLayoutContainer";

export interface PopupContainerProps {}

const PopupContainer: React.FC<React.PropsWithChildren<
  PopupContainerProps
>> = ({ children }) => {
  return (
    <PopupLayoutContext.Consumer>
      {(ref) => {
        if (ref) return ReactDOM.createPortal(children, ref);
      }}
    </PopupLayoutContext.Consumer>
  );
};

export default PopupContainer;
