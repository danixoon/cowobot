import { storiesOf } from "@storybook/react";
import React from "react";
import TextArea from ".";

storiesOf("Components/TextArea", module).add("simple", () => (
  <TextArea
    value={`Привет! Просмотри, пожалуйста, PR от пользователя \${BB_PR_REQUEST}!`}
  />
));
