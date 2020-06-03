import * as React from "react";

export type InputHook<T = any> = {
  input: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInput: React.Dispatch<React.SetStateAction<T>>;
};

export const useInput = function <T>(defaultValue: T = {} as T): InputHook<T> {
  const [input, setInput] = React.useState<T>(() => defaultValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedInput = { ...input } as any;
    changedInput[e.target.name] = e.target.value;
    setInput(changedInput);
  };
  return { input, onChange, setInput };
};
