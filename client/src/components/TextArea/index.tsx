import * as React from "react";
import Editor from "react-simple-code-editor";
import reactStringReplace from "react-string-replace";

import "./styles.scss";
import { DropdownPopup } from "../Input";

interface TextAreaProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  value: string;
}

interface TextVariableProps {
  value: string;
  onChange: (value: string) => void;
}
const TextVariable: React.FC<TextVariableProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const [opened, setOpened] = React.useState(() => false);

  const handleOnSelect = (value: string) => {
    setOpened(false);
    onChange(value);
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
        items={["BB_PR_REQUEST", "BB_PR_OWO"]}
      />
    </span>
  );
};

const TextArea: React.FC<TextAreaProps> = (props: TextAreaProps) => {
  const { children, value } = props;

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
                onChange={(value) => handleVariableSelect(match, value, offset)}
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
      padding="0.25rem"
      className="editor"
      textareaId="editor__text-area"
      textareaClassName="editor__text-area"
      preClassName="editor__pre"
      highlight={formatContent}
      onValueChange={(value) => {
        setInput(value);
      }}
      value={input || ""}
    />
  );
};

export default TextArea;
