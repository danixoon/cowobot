import * as React from "react";
import "./styles.scss";

type TreeItemProps = {
  items?: TreeItemProps[];
  content: string;
};

interface TreeProps extends React.InputHTMLAttributes<HTMLDivElement> {
  items: TreeItemProps[];
}

const renderTree = (items: TreeItemProps[], level: number = 0) =>
  items.map((item, i) => (
    <TreeItemComponent
      level={level}
      key={i}
      items={item.items}
      content={item.content}
    />
  ));

const TreeItemComponent: React.FC<TreeItemProps & { level: number }> = ({
  items,
  level,
  content,
  ...rest
}) => {
  const divRef = React.useRef<HTMLElement>();
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    () => undefined
  );
  const [opened, toggleOpened] = React.useState<boolean>(() => false);
  React.useEffect(() => {
    if (divRef.current) setMaxHeight(divRef.current.offsetHeight);
  }, [divRef.current]);

  return (
    <div
      className={"tree__item " + (items ? "tree__item_root" : "tree__item_end")}
    >
      <header
        onClick={() => toggleOpened(!opened)}
        className="tree-item__header"
      >
        {content}
      </header>
      <div
        style={{ maxHeight }}
        className={
          "tree-item__content " +
          (opened || !maxHeight
            ? "tree-item__content_opened"
            : "tree-item__content_closed")
        }
        ref={(ref) => (divRef.current = ref || undefined)}
      >
        {items && renderTree(items, level + 1)}
      </div>
    </div>
  );
};

const Tree: React.FC<TreeProps> = (props) => {
  const { items } = props;
  return <div className="tree">{renderTree(items)}</div>;
};

export default Tree;
