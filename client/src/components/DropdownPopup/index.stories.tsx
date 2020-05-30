import { storiesOf } from "@storybook/react";
import React from "react";
import DropdownPopup from ".";
import { useInput } from "../../hooks/useInput";

const items = ["aabbcc", "aaaacc", "aabbcd"].map((v, i) => ({
  id: i,
  name: v,
}));

storiesOf("Components/DropdownPopup", module)
  .add("opened", () => (
    <DropdownPopup opened={true} filter="" items={items} onSelect={() => {}} />
  ))
  .add("closed", () => (
    <DropdownPopup opened={false} filter="" items={items} onSelect={() => {}} />
  ))
  .add("filtered", () => (
    <DropdownPopup
      opened={true}
      filter="aab"
      items={items}
      onSelect={() => {}}
    />
  ));
