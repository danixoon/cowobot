import * as React from "react";
import "./styles.scss";
import { mergeProps } from "../../utils";

interface SectionProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  header: string;
  textAlign?: React.CSSProperties["textAlign"];
}

const Section: React.FC<SectionProps> = (props: SectionProps) => {
  const { header, textAlign, children, ...rest } = props;
  const mergedProps = mergeProps({ className: "section" }, rest);
  return (
    <section {...mergedProps}>
      <header style={{ textAlign }} className="section__header">
        <h3 className="section__h">{header}</h3>
      </header>
      {children}
    </section>
  );
};

export default Section;
