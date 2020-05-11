import React from "react";

interface InputWrapperProps {
  name: string;
  input: any;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInput?: (input: any) => void;
}
export const InputWrapper: React.FC<InputWrapperProps> = (props) => {
  const { children, name, input, onChange, setInput } = props;

  const child = React.Children.only(children) as any;

  return React.cloneElement(child, {
    name,
    value: input[name],
    onChange,
    setInput: (value: string) =>
      setInput && setInput({ ...input, [name]: value }),
  });
};
