import * as React from "react";

export type PreviousHook<T = any> = (props: T) => void;

export const usePrevious = <T>(props: T) => {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = props;
  });
  return ref.current;
};
