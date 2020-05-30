import * as React from "react";
import "./styles.scss";
import resetIcon from "../../icons/reload.svg";
import DropdownPopup from "../DropdownPopup";

interface LabelProps extends React.InputHTMLAttributes<HTMLLabelElement> {
  text: string;
}

const Label: React.FC<LabelProps> = (props) => {
  const { text, children, ...rest } = props;

  return (
    <span className="label__container">
      <label className="label__text">{text}</label>
      {children}
    </span>
  );
};

export default Label;
