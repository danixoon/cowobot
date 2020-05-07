import { storiesOf } from "@storybook/react";
import React from "react";
import Button from ".";

storiesOf("Components/Button", module)
  .add("secondary", () => <Button>Secondary Button</Button>)
  .add("primary", () => <Button color="primary">Primary button</Button>)
  .add("multiple", () => (
    <>
      <Button>Secondary Button</Button>
      <Button color="primary">Primary button</Button>
    </>
  ));
