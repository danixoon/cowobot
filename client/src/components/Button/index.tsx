import * as React from "react";
import "./styles.scss";

const Button: React.FC<any> = (props) => {
  const [active, toggle] = React.useState(() => false);
  const { children, ...rest } = props;

  return (
    <button className="btn" onClick={() => toggle(!active)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
