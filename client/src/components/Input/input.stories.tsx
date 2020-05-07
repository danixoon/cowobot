import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";

storiesOf("Components/Input", module).add("default", () => (
  <Input placeholder="текст" />
));
storiesOf("Components/Input", module).add("resetable", () => (
  <Input isResetable={true} placeholder="текст" value="BB_PR_REVIEWER" />
));
