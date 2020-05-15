import * as React from "react";
// import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Editor from "react-simple-code-editor";
import reactStringReplace from "react-string-replace";

import "./styles.scss";
import { DropdownPopup } from "../Input";

interface TextAreaProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  value: string;
}

const Cursor: React.FC<any> = ({ focus }) => {
  const [show, setShow] = React.useState(() => true);

  React.useEffect(() => {
    if (focus) {
      const timer = setTimeout(() => {
        setShow(!show);
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <span style={{ visibility: show && focus ? "visible" : "hidden" }}>|</span>
  );
};

interface TextVariableProps {
  value: string;
  onChange: (value: string) => void;
}
const TextVariable: React.FC<TextVariableProps> = ({ value, onChange }) => {
  const [opened, setOpened] = React.useState(() => false);

  const handleOnSelect = (value: string) => {
    setOpened(false);
    onChange(value);
  };

  return (
    <span
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
    const result = reactStringReplace(
      content,
      /\${(.+)}/,
      (match, i, offset) => {
        return (
          <span key={i} style={{ color: "purple" }}>
            {"${"}
            {reactStringReplace(match, /(.+)/, (match, i) => (
              <TextVariable
                onChange={(value) =>
                  handleVariableSelect(match, value, offset + 2)
                }
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
    // return formatted;
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

  // const onChange = (e: ContentEditableEvent) => {
  //   console.log("before: ", input);
  //   console.log("after: ", e.target.value);
  //   console.log("formatted: ", formatContent(e.target.value));
  //   setInput(formatContent(e.target.value));
  // };

  // const handleOnClick = () => {};
  // const handleOnFocus = () => {
  //   console.log("focused");
  //   setFocus(true);
  // };
  // const handleOnKeyDown = (e: React.KeyboardEvent<HTMLPreElement>) => {
  //   setInput(input + String.fromCharCode(e.keyCode));
  // };

  // return (
  //   <pre
  //     tabIndex={0}
  //     onKeyDown={handleOnKeyDown}
  //     onFocus={handleOnFocus}
  //     onClick={handleOnClick}
  //   >
  //     <>
  //       {formatContent(input || "")} <Cursor focus={focus} />
  //     </>
  //   </pre>
  // );

  // return <ContentEditable onChange={onChange} html={input || ""} />;
};

export default TextArea;
