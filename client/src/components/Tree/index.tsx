import * as React from "react";
import "./styles.scss";

type TreeItemEnd<T = string> = { id: T; content: string };
type TreeItemRoot = { items: TreeItemData[] };

type TreeItemData<T = string> = {
  content: string;
} & (TreeItemEnd<T> | TreeItemRoot);

interface TreeProps extends React.InputHTMLAttributes<HTMLDivElement> {
  items: TreeItemData[];
  onItemSelect: (id: string) => void;
}

const renderTree = (items: TreeItemData[]) =>
  items.map((item, i) => (
    <TreeContext.Consumer key={i}>
      {(context) => <TreeItemComponent {...context} data={item} />}
    </TreeContext.Consumer>
  ));

type TreeItemProps = {
  selectedId: string | null;
  onItemSelect: (id: string) => void;
  data: TreeItemData;
};
const TreeItemComponent: React.FC<TreeItemProps> = React.memo(
  ({ onItemSelect, selectedId, data }) => {
    const items = (data as any).items;
    const id = (data as any).id;
    const content = data.content;

    const divRef = React.useRef<HTMLElement | null>();
    const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
      () => undefined
    );
    const [isHeightCalculated, setHeightCalculated] = React.useState<boolean>(
      () => false
    );
    const [opened, toggleOpened] = React.useState<boolean>(() => false);

    const isRoot = items !== undefined;

    React.useEffect(() => {
      if (!isHeightCalculated) {
        if (divRef.current) {
          setMaxHeight(divRef.current.clientHeight);
          setHeightCalculated(true);
        } else if (!isRoot) setHeightCalculated(true);
      }
    }, [divRef.current]);

    const handleToggleBranch = () => {
      toggleOpened(!opened);
    };

    const renderOpened = !isHeightCalculated || opened;

    return (
      <div
        className={`tree__item ${
          isRoot
            ? `tree__item_root ${renderOpened ? " tree__item_root-opened" : ""}`
            : `tree__item_end ${
                id === selectedId ? " tree__item_end-opened" : ""
              }`
        }`}
        style={{ visibility: isHeightCalculated ? "visible" : "hidden" }}
      >
        <button
          onClick={isRoot ? handleToggleBranch : () => onItemSelect(id)}
          className="tree-item__header"
        >
          {content}
        </button>
        {items && (
          <div
            style={{ maxHeight: maxHeight || undefined }}
            className={
              "tree-item__content " +
              (renderOpened
                ? "tree-item__content_opened"
                : "tree-item__content_closed")
            }
            ref={(ref) => (divRef.current = ref || undefined)}
          >
            {items && renderTree(items)}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    nextProps.selectedId !== (nextProps.data as any).id &&
    prevProps.selectedId !== (prevProps.data as any).id
);

type TreeContextProps = {
  selectedId: string | null;
  onItemSelect: (id: string) => void;
};
const TreeContext = React.createContext<TreeContextProps>({
  selectedId: null,
  onItemSelect: (id: string) => {},
});
const Tree: React.FC<TreeProps> = (props) => {
  const { items, onItemSelect, ...rest } = props;
  const [selectedId, setSelectId] = React.useState<string | null>(() => null);

  const handleOnItemSelect = (id: string) => {
    setSelectId(id);
    onItemSelect(id);
  };

  return (
    <TreeContext.Provider
      value={{ selectedId, onItemSelect: handleOnItemSelect }}
    >
      <div className="tree" {...rest}>
        {renderTree(items)}
      </div>
    </TreeContext.Provider>
  );
};

export default Tree;
