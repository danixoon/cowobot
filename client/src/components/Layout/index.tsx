import * as React from "react";
import "./styles.scss";
import { mergeClassNames, mergeProps } from "../../utils";

export type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  direction: "row" | "column";
  mt?: boolean;
  mb?: boolean;
  ml?: boolean;
  mr?: boolean;
  bg?: boolean;
  wrap?: boolean;
};

const Layout: React.FC<React.PropsWithChildren<
  LayoutProps
>> = (props) => {
  const {
    children,
    direction = "column",
    wrap = false,
    mt,
    mr,
    mb,
    ml,
    bg,
    ...rest
  } = props;
  const margin = [mt, mr, mb, ml];
  const mergedProps = mergeProps(
    {
      className: mergeClassNames(
        "container-layout",
        props.direction && `container-layout_${props.direction}`,
        props.wrap && `container-layout_wrap`,
        bg && "bg-main"
      ),
      style: {
        margin: margin.map((v) => (v ? "0.25rem" : "0")).join(" "),
      },
    },
    rest
  );

  return <div {...mergedProps}>{children}</div>;
};

export default Layout;
