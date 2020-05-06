import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";

storiesOf("Button", module)
  .add("with text", () => <Input>Hello Button</Input>)
  .add("with some emoji", () => <Input>😀 😎 👍 💯</Input>);
