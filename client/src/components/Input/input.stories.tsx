import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";

storiesOf("Components/Input", module).add("simple", () => (
  <Input placeholder="текст" />
));
storiesOf("Components/Input", module).add("with reset", () => (
  <Input isResetable placeholder="текст" defaultValue="BB_PR_REVIEWER" />
));
storiesOf("Components/Input", module).add("with label", () => (
  <Input
    defaultValue="BB_PR_REVIEWER"
    placeholder="текст"
    label="Имя ревьювера"
  />
));

storiesOf("Components/Input", module).add("multiple", () => (
  <>
    <Input
      defaultValue="BB_PR_REVIEWER"
      placeholder="текст"
      label="Имя ревьювера"
    />
    <Input isResetable placeholder="текст" defaultValue="BB_PR_REVIEWER" />
  </>
));
