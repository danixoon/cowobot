import * as React from "react";
import "./styles.scss";

interface DropdownPopupProps {
  items: { id: number; name: string }[];
  filter: string;
  opened?: boolean;
  focusOpen?: boolean;
  onSelect: (id: number) => void;
}

export const DropdownPopup: React.FC<DropdownPopupProps> = ({
  items,
  filter,
  opened,
  onSelect,
}) => {
  const sortedItems = items
    .filter((v) =>
      filter === ""
        ? true
        : v.name.toLowerCase().startsWith(filter.toLowerCase())
    )
    .sort();

  const handleSelect = (id: number) => {
    onSelect(id);
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
                handleSelect(item.id);
              }}
              key={item.id}
              className="dropdown-popup__item"
            >
              {filtered ? item.name.substring(0, filter.length) : item.name}
              {filtered && (
                <span className="col_muted">
                  {item.name.substring(filter.length)}
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
