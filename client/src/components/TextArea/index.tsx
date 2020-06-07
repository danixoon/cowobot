import * as React from "react";
import Editor from "react-simple-code-editor";
import reactStringReplace from "react-string-replace";

import "./styles.scss";
import DropdownPopup from "../DropdownPopup";
import { usePrevious } from "../../hooks/usePrevious";

export interface TextAreaProps
  extends Omit<
    React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
    "onChange"
  > {
  value: string;
  tokens: { key: any; name: string }[];
  onChange: (value: string) => void;
}

interface TextVariableProps {
  value: string;
  items: { key: any; name: string }[];
  onChange: (key: any) => void;
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
  const { children, tokens, onChange, value, ...rest } = props;

  const savedTokens = React.useRef<
    {
      name: string;
      key: any;
    }[]
  >([]);

  const prevTokens = usePrevious(tokens);

  React.useEffect(() => {
    if (!prevTokens) return;

    let input = value;

    for (let savedToken of savedTokens.current) {
      const token = tokens.find((token) => token.key === savedToken.key);
      if (token)
        input = input.replace(
          `\${${savedToken.name}}`,
          `\${${token?.name ?? savedToken}}`
        );
    }
    if (input !== value) onChange(input);
  }, [tokens]);

  const handleVariableSelect = (
    before: string,
    after: string,
    offset: number
  ) => {
    const replaced =
      value.substr(0, offset) + after + value.substr(offset + before.length);
    onChange(replaced);
  };

  const formatContent = (content: string): React.ReactNodeArray => {
    let offsetI = 0;
    let saved: any[] = [];
    const result = reactStringReplace(
      content,
      /\${(.*?)}/,
      (match, i, offset) => {
        offset += 2 + offsetI++ * 3;
        return (
          <span key={i} style={{ color: "purple" }}>
            {"${"}
            {reactStringReplace(match, /(.+)/, (match, i) => {
              if (prevTokens) {
                const token = prevTokens.find((token) => token.name === match);
                if (token) {
                  saved.push({ key: token.key, name: match });
                }
              }

              return (
                <TextVariable
                  onChange={(id) => {
                    const variable = tokens.find((v) => v.key === id);
                    if (variable)
                      handleVariableSelect(match, variable.name, offset);
                  }}
                  items={tokens}
                  value={match}
                  key={i}
                />
              );
            })}
            {"}"}
          </span>
        );
      }
    );
    savedTokens.current = saved;
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
      onValueChange={(input) => onChange(input)}
      value={value}
    />
  );
};

export default TextArea;
