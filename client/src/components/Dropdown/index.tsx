import * as React from "react";
import "./styles.scss";
import dropdownToggleIcon from "./dropdownToggleIcon.svg";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { items } = props;

  const [{ opened, selectedId }, setState] = React.useState(() => ({
    opened: false,
    selectedId: 0,
  }));

  const dropdownItems = items
    .sort()
    .map((item, i) => ({ id: i, item }))
    .filter((v) => v.id !== selectedId);

  const handleDropdownToggle = (open?: boolean) => {
    setState({ opened: open !== undefined ? open : !opened, selectedId });
  };

  const handleItemSelect = (id: number) => {
    setState({ opened: false, selectedId: id });
  };

  return (
    <div onMouseLeave={() => handleDropdownToggle(false)} className="dropdown">
      <div
        onClick={() => handleDropdownToggle()}
        className={
          "dropdown__selected-item" +
          (opened ? " dropdown__selected-item_opened" : "")
        }
      >
        {items[selectedId]}
      </div>
      <div
        className={
          "dropdown__container" + (opened ? " dropdown__container_opened" : "")
        }
      >
        {dropdownItems.map((v) => (
          <div
            onClick={() => handleItemSelect(v.id)}
            key={v.item}
            className="dropdown__item"
          >
            {v.item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
