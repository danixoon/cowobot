import * as React from "react";
import "./styles.scss";
import resetIcon from "./reset-icon.svg";

const DropdownPopup: React.FC<any> = (props) => {
  return (
    <div className="input__dropdown-popup">
      <div className="dropdown-popup__item"> ЭЛЕМЕНТ ОДИН </div>
      <div className="dropdown-popup__item"> ЭЛЕМЕНТ ДВА </div>
    </div>
  );
};

type InputProps = {
  isResetable?: boolean;
  isDropdown?: boolean;
  dropdownItems?: string[];
  onReset?: (e: any) => void;

  label?: string;
};

const Input: React.FC<any> = (props: InputProps) => {
  const {
    isResetable,
    onReset,
    isDropdown,
    dropdownItems,
    label,
    ...rest
  } = props;
  return (
    <span className="input__container">
      {label && <label className="input__label">{label}</label>}
      <div className="input__element-container">
        <input
          {...rest}
          className={
            "input__element" +
            (isResetable ? "_reset" : "") +
            (isResetable ? " input__element_dropdown" : "")
          }
        />
        {isDropdown && <DropdownPopup />}
        {isResetable && (
          <span onClick={onReset} className="input__reset">
            <img src={resetIcon} />
          </span>
        )}
      </div>
    </span>
  );
};

export default Input;
