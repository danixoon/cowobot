import { storiesOf } from "@storybook/react";
import React from "react";
import Dropdown from ".";

storiesOf("Components/Dropdown", module).add("simple", () => (
  <Dropdown
    selectedKey={1}
    items={["Ревью PR", "item2", "КОШКОДЕВоЧКА"].map((v, i) => ({
      key: i,
      name: v,
    }))}
  />
));
