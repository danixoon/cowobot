import * as React from "react";
import Editor from "react-simple-code-editor";
import reactStringReplace from "react-string-replace";

import "./styles.scss";
import DropdownPopup from "../DropdownPopup";

export type TextAreaProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
> & {
  value: string;
  variables: { id: number; name: string }[];
  onInputChange?: (value: string) => void;
};

interface TextVariableProps {
  value: string;
  items: { id: number; name: string }[];
  onChange: (id: number) => void;
}
const TextVariable: React.FC<TextVariableProps> = ({
  value,
  items,
  onChange,
  ...rest
}) => {
  const [opened, setOpened] = React.useState(() => false);

  const handleOnSelect = (id: number) => {
    setOpened(false);
    onChange(id);
  };

  return (
    <span
      {...rest}
      onFocus={() => setOpened(true)}
      onBlur={() => setOpened(false)}
      tabIndex={0}
      className="text-area__variable"
    >
      {value}
      <DropdownPopup
        opened={opened}
        filter={""}
        onSelect={handleOnSelect}
        items={items}
      />
    </span>
  );
};

const TextArea: React.FC<TextAreaProps> = (props: TextAreaProps) => {
  const { children, onInputChange, variables, value, ...rest } = props;

  const [input, setInput] = React.useState(() => value);
  const [edit, setEdit] = React.useState(() => false);

  const editor = React.useRef<Editor>();

  const handleVariableSelect = (
    before: string,
    after: string,
    offset: number
  ) => {
    const replaced =
      input.substr(0, offset) + after + input.substr(offset + before.length);
    setInput(replaced);
  };

  const formatContent = (content: string): React.ReactNodeArray => {
    let offsetI = 0;
    const result = reactStringReplace(
      content,
      /\${(.*?)}/,
      (match, i, offset) => {
        offset += 2 + offsetI++ * 3;
        return (
          <span key={i} style={{ color: "purple" }}>
            {"${"}
            {reactStringReplace(match, /(.+)/, (match, i) => (
              <TextVariable
                onChange={(id) => {
                  const variable = variables.find((v) => v.id === id);
                  if (variable)
                    handleVariableSelect(match, variable.name, offset);
                }}
                items={variables}
                value={match}
                key={i}
              />
            ))}
            {"}"}
          </span>
        );
      }
    );
    return result;
  };

  return (
    <Editor
      // style={{ height: "4rem" }}
      style={rest.style}
      padding="0.25rem"
      className="editor"
      textareaId="editor__text-area"
      textareaClassName="editor__text-area"
      preClassName="editor__pre"
      highlight={formatContent}
      onValueChange={(value) => {
        setInput(value);
        if (onInputChange) onInputChange(value);
      }}
      value={input || ""}
    />
  );
};

export default TextArea;
