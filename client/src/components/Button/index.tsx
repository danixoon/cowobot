import * as React from "react";
import "./styles.scss";

interface ButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  color?: "secondary" | "primary";
  size?: "sm" | "md";
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const [active, toggle] = React.useState(() => false);
  const { children, color = "secondary", size = "md", ...rest } = props;

  return (
    <button
      className={`btn btn_${color} btn_${size}`}
      onClick={() => toggle(!active)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
