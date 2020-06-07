import { storiesOf } from "@storybook/react";
import React from "react";
import TextArea from ".";

storiesOf("Components/TextArea", module).add("simple", () => (
  <TextArea
    onChange={(value) => value}
    value={`Привет \${BB_PR_REVIEWER}! Просмотри, пожалуйста, PR от пользователя \${BB_PR_REQUEST}!`}
    tokens={[
      { key: 1, name: "BB_PR_REVIEWER" },
      { key: 2, name: "BB_PR_REQUEST" },
    ]}
  />
));
