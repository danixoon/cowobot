import * as React from "react";
import "./styles.scss";
import { mergeClassNames, mergeProps } from "../../utils";
import DialogPopup from "../../components/DialogPopup";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Form from "../../components/Form";
import Section from "../../components/Section";
import Button from "../../components/Button";
import Label from "../../components/Label";
import { ConnectedProps } from "react-redux";
import { authPopupEnchancer } from "../../containers/AuthPopupContainer";

export type AuthPopupProps = React.HTMLAttributes<HTMLDivElement> &
  ConnectedProps<typeof authPopupEnchancer>;

const AuthPopup: React.FC<AuthPopupProps> = (props) => {
  const { login, error, isAuth } = props;
  const bindInput = useInput({} as any);
  const { input } = bindInput;
  // const mergedProps = mergeProps({}, rest);

  const handleOnSubmit = () => {
    login({ username: input.username, password: input.password });
  };

  // React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (status === "error" && error) alert(error);
  }, [status]);

  return (
    <DialogPopup opened={!isAuth}>
      <Section textAlign="center" header="Войдите в аккаунт">
        <Form onSubmit={handleOnSubmit} style={{ padding: "0 2rem" }}>
          <Label text="Имя пользователя">
            <Input name="username" type="username" {...bindInput} />
          </Label>
          <Label text="Пароль">
            <Input name="password" type="password" {...bindInput} />
          </Label>
          <Button
            disabled={status === "loading"}
            type="submit"
            style={{ width: "100%", marginTop: "1rem" }}
            color="primary"
          >
            Войти
          </Button>
        </Form>
      </Section>
    </DialogPopup>
  );
};

export default AuthPopup;
