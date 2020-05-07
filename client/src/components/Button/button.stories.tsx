import { storiesOf } from "@storybook/react";
import React from "react";
import Button from ".";

storiesOf("Components/Button", module)
  .add("with text", () => <Button>Hello Button</Button>)
  .add("with some emoji", () => <Button>😀 😎 👍 💯</Button>);
