import { storiesOf } from "@storybook/react";
import React from "react";
import Dropdown from ".";

storiesOf("Components/Dropdown", module).add("simple", () => (
  <Dropdown items={["Ревью PR", "item2", "КОШКОДЕВоЧКА"]} />
));
