import { storiesOf } from "@storybook/react";
import React from "react";
import AccountPanel from ".";
import avatarUrl from "../../images/avatar.png";

storiesOf("Components/Account Panel", module).add("simple", () => (
  <AccountPanel logout={() => {}} username="danixoon" avatarUrl={avatarUrl} />
));
