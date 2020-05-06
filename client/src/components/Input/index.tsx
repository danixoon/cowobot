import * as React from "react";
import "./styles.scss";
import resetIcon from "./reset-icon.svg";
import Button from "../Button";

const Input: React.FC<any> = (props) => {
  return (
    <span className="input__container">
      <input {...props} className="input__element" />
      <span className="input__reset">
        <img src={resetIcon} />
      </span>
    </span>
  );
};

export default Input;
