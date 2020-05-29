import * as React from "react";
import "./styles.scss";

type FormProps = React.HTMLAttributes<HTMLFormElement> & {
  onSubmit?: (data: FormData) => void;
  preventDefault?: boolean;
};

const Form: React.FC<React.PropsWithChildren<FormProps>> = (
  props: FormProps
) => {
  const { children, preventDefault = true, onSubmit, ...rest } = props;

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (preventDefault) e.preventDefault();

    if (!onSubmit) return;
    const data = new FormData(e.target as HTMLFormElement);
    onSubmit(data);
  };

  return (
    <form {...rest} onSubmit={handleOnSubmit} className="form">
      {children}
    </form>
  );
};

export default Form;
