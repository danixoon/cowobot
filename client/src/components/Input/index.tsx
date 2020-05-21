import * as React from "react";
import "./styles.scss";
import resetIcon from "./reset-icon.svg";
import DropdownPopup from "../DropdownPopup";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isResetable?: boolean;
  isDropdown?: boolean;
  dropdownItems?: string[];
  setInput?: (value: string) => void;

  label?: string;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    isResetable,
    onReset,
    onChange,
    setInput,
    value,
    name,
    isDropdown,
    dropdownItems,
    label,
    defaultValue = "",
    ...rest
  } = props;

  const [state, setState] = React.useState(() => ({
    reset: false,
    dropdownOpened: false,
  }));

  let nextValue = value;
  if (state.reset) {
    nextValue = defaultValue;
    setState({ ...state, reset: false });
  }

  const handleInputFocus = (focus: boolean) => {
    setState({ ...state, dropdownOpened: focus });
  };

  return (
    <span className="input__container">
      {label && <label className="input__label">{label}</label>}
      <div className="input__element-container">
        <input
          {...rest}
          onFocus={() => handleInputFocus(true)}
          onBlur={() => handleInputFocus(false)}
          onChange={onChange}
          value={nextValue}
          name={name}
          autoComplete={isDropdown ? "off" : undefined}
          className={
            "input__element" +
            (isResetable ? "_reset" : "") +
            (isDropdown ? " input__element_dropdown" : "")
          }
        />
        {isDropdown && (
          <DropdownPopup
            opened={state.dropdownOpened}
            filter={value?.toString() || ""}
            items={dropdownItems || []}
            onSelect={(item) => {
              setInput && setInput(item);
            }}
          />
        )}
        {isResetable && (
          <span
            onClick={() => setInput && setInput(defaultValue?.toString() || "")}
            className="input__reset"
          >
            <img src={resetIcon} />
          </span>
        )}
      </div>
    </span>
  );
};

export default Input;
