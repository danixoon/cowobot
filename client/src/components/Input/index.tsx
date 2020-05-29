import * as React from "react";
import "./styles.scss";
import resetIcon from "../../icons/reload.svg";
import DropdownPopup from "../DropdownPopup";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isResetable?: boolean;
  isDropdown?: boolean;
  dropdownItems?: string[];
  label?: string;
  setInput?: (input: any) => void;

  input: any;
  name: string;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    isResetable,
    onReset,
    onChange,
    setInput,
    input = {},
    name,
    isDropdown,
    dropdownItems,
    label,
    defaultValue = "",
    value,
    ...rest
  } = props;

  const [state, setState] = React.useState(() => ({
    reset: false,
    dropdownOpened: false,
  }));

  const inputValue = (setInput ? input[name] : value) ?? "";

  let nextValue = inputValue;
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
            filter={inputValue?.toString() || ""}
            items={dropdownItems || []}
            onSelect={(item) => {
              setInput && setInput({ ...input, [name]: item });
            }}
          />
        )}
        {isResetable && (
          <span
            onClick={() =>
              setInput &&
              setInput({ ...input, [name]: defaultValue?.toString() || "" })
            }
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
