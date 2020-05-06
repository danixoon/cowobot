import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";

storiesOf("Components/Input", module).add("with text", () => (
  <Input value="BB_PR_REVIEWER" />
));
storiesOf("Components/Input", module).add("with placeholder", () => (
  <Input placeholder="введи шото" />
));
