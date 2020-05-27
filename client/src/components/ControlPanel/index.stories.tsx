import { storiesOf } from "@storybook/react";
import React from "react";
import ControlPanel from ".";
import Form from "../Form";
import Button from "../Button";
import PopupLayoutProvider from "../../providers/PopupLayoutProvider";
import avatarUrl from "../../images/avatar.png";

storiesOf("Components/Control Panel", module).add("simple", () => (
  <ControlPanel></ControlPanel>
));
