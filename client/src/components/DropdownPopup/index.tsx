import * as React from "react";
import "./styles.scss";

interface DropdownPopupProps {
  items: string[];
  filter: string;
  opened?: boolean;
  focusOpen?: boolean;
  onSelect: (item: string) => void;
}

export const DropdownPopup: React.FC<DropdownPopupProps> = ({
  items,
  filter,
  opened,
  onSelect,
}) => {
  const sortedItems = items
    .filter((v) =>
      filter === "" ? true : v.toLowerCase().startsWith(filter.toLowerCase())
    )
    .sort();

  const handleSelect = (item: string) => {
    onSelect(item);
  };

  return (
    <div
      className={"dropdown-popup " + (opened ? "dropdown-popup_opened" : "")}
    >
      <div className="dropdown-popup__container">
        {sortedItems.map((item) => {
          const filtered = filter !== "";
          return (
            <div
              onMouseDown={(e) => {
                handleSelect(item);
              }}
              key={item}
              className="dropdown-popup__item"
            >
              {filtered ? item.substring(0, filter.length) : item}
              {filtered && (
                <span className="col_muted">
                  {item.substring(filter.length)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownPopup;
