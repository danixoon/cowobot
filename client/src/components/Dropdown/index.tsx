import * as React from "react";
import "./styles.scss";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { name: string; key: any }[];
  selectedKey: any;
  onItemSelect?: (key: any) => void;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { items, onItemSelect, selectedKey } = props;

  const [{ opened }, setState] = React.useState(() => ({
    opened: false,
    // selectedId:
    //   typeof selectedKey === "undefined"
    //     ? items.length > 0
    //       ? items[0].key
    //       : null
    //     : selectedKey,
  }));

  const dropdownItems = items.filter((v) => v.key !== selectedKey);

  const handleDropdownToggle = (open?: boolean) => {
    setState({ opened: open !== undefined ? open : !opened });
  };

  const handleItemSelect = (id: number) => {
    setState({ opened: false });
    if (onItemSelect) {
      onItemSelect(id);
    }
  };

  const selectedItem = items.find((item) => item.key === selectedKey);

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        onClick={() => handleDropdownToggle()}
        onBlur={() => handleDropdownToggle(false)}
        className={
          "dropdown__selected-item" +
          (opened ? " dropdown__selected-item_opened" : "")
        }
      >
        {selectedItem?.name}
      </div>
      <div
        className={
          "dropdown__container" + (opened ? " dropdown__container_opened" : "")
        }
      >
        {dropdownItems.map((v, i) => {
          return (
            <div
              tabIndex={0}
              onMouseDown={() => handleItemSelect(v.key)}
              key={v.key}
              className="dropdown__item"
            >
              {v.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
