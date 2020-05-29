import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.scss";
import { PopupLayoutContext } from "../../providers/PopupLayoutProvider";
import PopupProvider from "../../providers/PopupProvider";
import AccountPanel from "../AccountPanel";
import Layout from "../Layout";
import { mergeProps } from "../../utils";

interface ControlPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const ControlPanel: React.FC<React.PropsWithChildren<ControlPanelProps>> = (
  props: ControlPanelProps
) => {
  const { ...rest } = props;
  const mergedProps = mergeProps({ className: "control-panel" }, rest);

  return <div {...mergedProps}></div>;
};

export default ControlPanel;
