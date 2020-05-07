import * as React from "react";
import "./styles.scss";

interface ButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  color?: "secondary" | "primary";
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const [active, toggle] = React.useState(() => false);
  const { children, color = "secondary", ...rest } = props;

  return (
    <button
      className={`btn btn_${color}`}
      onClick={() => toggle(!active)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
