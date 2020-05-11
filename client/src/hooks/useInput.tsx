import * as React from "react";

export const useInput = function <T>(defaultValue: T = {} as T) {
  const [input, setInput] = React.useState<T>(() => defaultValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedInput = { ...input } as any;
    changedInput[e.target.name] = e.target.value;
    setInput(changedInput);
  };
  return [input, { onChange }, setInput] as [
    T,
    { onChange: typeof onChange },
    typeof setInput
  ];
};
