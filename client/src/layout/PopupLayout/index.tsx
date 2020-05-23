import * as React from "react";
import "./styles.scss";

export interface PopupLayoutProps {}

const PopupLayout = React.forwardRef<HTMLDivElement>((props, layoutRef) => {
  return <div ref={layoutRef} className="popup-layout" />;
});

export default PopupLayout;
