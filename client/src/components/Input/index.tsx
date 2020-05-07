import * as React from "react";
import "./styles.scss";
import resetIcon from "./reset-icon.svg";

type InputProps = {
  isResetable?: boolean;
  onReset?: (e: any) => void;

  label?: string;
};

const Input: React.FC<any> = (props: InputProps) => {
  const { isResetable, onReset, label, ...rest } = props;
  return (
    <span className="input__container">
      {label && <label className="input__label">{label}</label>}
      <input
        {...rest}
        className={"input__element" + (isResetable ? "_reset" : "")}
      />
      {isResetable && (
        <span onClick={onReset} className="input__reset">
          <img src={resetIcon} />
        </span>
      )}
    </span>
  );
};

export default Input;
