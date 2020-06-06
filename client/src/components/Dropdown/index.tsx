import * as React from "react";
import "./styles.scss";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { name: string; key: any }[];
  defaultSelectedId?: number;
  onItemSelect?: (key: any) => void;
}

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { items, onItemSelect, defaultSelectedId } = props;

  const [{ opened, selectedId }, setState] = React.useState(() => ({
    opened: false,
    selectedId:
      typeof defaultSelectedId === "undefined"
        ? items[0].key
        : defaultSelectedId,
  }));

  const dropdownItems = items.filter((v) => v.key !== selectedId);

  const handleDropdownToggle = (open?: boolean) => {
    setState({ opened: open !== undefined ? open : !opened, selectedId });
  };

  const handleItemSelect = (id: number) => {
    setState({ opened: false, selectedId: id });
    if (onItemSelect) {
      onItemSelect(id);
    }
  };

  const selectedItem = items.find((item) => item.key === selectedId);

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
