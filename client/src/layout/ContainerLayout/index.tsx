import * as React from "react";
import "./styles.scss";
import { mergeClassNames, mergeProps } from "../../utils";

export type ContainerLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  direction: "row" | "column";
  wrap?: boolean;
};

const ContainerLayout: React.FC<React.PropsWithChildren<
  ContainerLayoutProps
>> = (props) => {
  const { children, direction = "column", wrap = false, ...rest } = props;
  const mergedProps = mergeProps(
    {
      className: mergeClassNames(
        "container-layout",
        props.direction && `container-layout_${props.direction}`,
        props.wrap && `container-layout_wrap`
      ),
    },
    rest
  );

  return <div {...mergedProps}>{children}</div>;
};

export default ContainerLayout;
