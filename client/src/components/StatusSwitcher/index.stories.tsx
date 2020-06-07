import { storiesOf } from "@storybook/react";
import React from "react";
import StatusSwitcher from ".";

storiesOf("Components/Form", module).add("simple", () => (
  <StatusSwitcher loading={<div>hi</div>} status="loading" />
));
