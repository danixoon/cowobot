import * as React from "react";
import "./styles.scss";

interface SectionProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  header: string;
  textAlign?: React.CSSProperties["textAlign"];
}

const Section: React.FC<SectionProps> = (props: SectionProps) => {
  const { header, textAlign, children } = props;
  return (
    <section className="section">
      <header style={{ textAlign }} className="section__header">
        <h3 className="section__h">{header}</h3>
      </header>
      {children}
    </section>
  );
};

export default Section;
