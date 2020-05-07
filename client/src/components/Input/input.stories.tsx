import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";

storiesOf("Components/Input", module)
  .add("simple", () => <Input placeholder="текст" />)
  .add("with reset", () => (
    <Input isResetable placeholder="текст" defaultValue="BB_PR_REVIEWER" />
  ))
  .add("with label", () => (
    <Input
      defaultValue="BB_PR_REVIEWER"
      placeholder="текст"
      label="Имя ревьювера"
    />
  ))
  .add("with dropdown", () => (
    <Input
      defaultValue="BB_PR_REVIEWER"
      placeholder="текст"
      isResetable
      isDropdown
      label="Выпадающий список"
    />
  ))
  .add("multiple", () => (
    <>
      <Input
        defaultValue="BB_PR_REVIEWER"
        placeholder="текст"
        label="Имя ревьювера"
      />
      <Input isResetable placeholder="текст" defaultValue="BB_PR_REVIEWER" />
    </>
  ));
