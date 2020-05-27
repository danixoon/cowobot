export const mergeClassNames = (
  ...names: (string | undefined | false | null)[]
) => {
  return names.filter((name) => typeof name === "string").join(" ");
};

export const mergeProps = <T, P>(
  newProps: React.HTMLAttributes<T>,
  props: P
): React.HTMLAttributes<T> & P => {
  return {
    ...props,
    ...newProps,
    className: `${newProps.className ?? ""}`,
    style: { ...((props as any).style ?? {}), ...(newProps.style ?? {}) },
  };
};
