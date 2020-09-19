import { getAction } from "../redux/types";

export const mergeClassNames = (
  ...names: (string | undefined | false | null)[]
) => {
  return names.filter((name) => typeof name === "string").join(" ");
};

export const mergeProps = <T, P>(
  ownProps: P = {} as P,
  newProps: React.HTMLAttributes<T>
): React.HTMLAttributes<T> & P => {
  return {
    ...ownProps,
    ...newProps,
    className: mergeClassNames((ownProps as any).className, newProps.className),
    style: { ...((ownProps as any).style ?? {}), ...(newProps.style ?? {}) },
  };
};
