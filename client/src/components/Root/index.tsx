import * as React from "react";
import "../../sass/theme.scss";
import Button from "../Button";
import Input from "../Input";

const Root: React.FC<any> = (props) => (
  <>
    <Button> Тест </Button> <Button> Сохранить </Button>
    <Input />
  </>
);

export default Root;
