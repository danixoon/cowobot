import * as React from "react";

export type InputHook<T = any> = {
  input: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInput: (value: T) => void;
};

export const useInput = function <T = any>(
  defaultValue: T = {} as T
): InputHook<T> {
  const [input, setInput] = React.useState<T>(() => defaultValue);
  const handleSetInput = (value: T) => {
    setInput(value);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedInput = { ...input } as any;
    changedInput[e.target.name] = e.target.value;
    setInput(changedInput);
  };
  return { input, onChange, setInput: handleSetInput };
};
