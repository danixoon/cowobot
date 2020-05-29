export const mergeClassNames = (
  ...names: (string | undefined | false | null)[]
) => {
  return names.filter((name) => typeof name === "string").join(" ");
};

export const mergeProps = <T, P>(
  newProps: React.HTMLAttributes<T>,
  props: P = {} as P
): React.HTMLAttributes<T> & P => {
  return {
    ...props,
    ...newProps,
    className: mergeClassNames((props as any).className, newProps.className),
    style: { ...((props as any).style ?? {}), ...(newProps.style ?? {}) },
  };
};
