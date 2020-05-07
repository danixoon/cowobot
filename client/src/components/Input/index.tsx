import * as React from "react";
import "./styles.scss";
import resetIcon from "./reset-icon.svg";
import Button from "../Button";

type InputProps = {
  isResetable?: boolean;
  onReset?: (e: any) => void;
};

const Input: React.FC<any> = (props: InputProps) => {
  const { isResetable, onReset } = props;
  return (
    <span className="input__container">
      <input {...props} className="input__element" />
      {isResetable && (
        <span onClick={onReset} className="input__reset">
          <img src={resetIcon} />
        </span>
      )}
    </span>
  );
};

export default Input;
