import { storiesOf } from "@storybook/react";
import React from "react";
import Section from ".";

storiesOf("Components/Section", module).add("simple", () => (
  <Section header="Заголовок">Содержимое</Section>
));
