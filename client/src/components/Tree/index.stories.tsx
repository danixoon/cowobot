import { storiesOf } from "@storybook/react";
import React from "react";
import Tree from ".";

const items = [
  {
    content: "Group 1",
    items: [
      {
        content: "Group 1-1",
        items: [
          { content: "Item 1-1-1" },
          { content: "Item 1-1-2" },
          { content: "Item 1-1-3" },
        ],
      },
      {
        content: "Group 1-2",
        items: [{ content: "Item 1-2-1" }],
      },
      {
        content: "Item 1-1",
      },
    ],
  },
  {
    content: "Group 2",
    items: [
      {
        content: "Item 2-1",
      },
      {
        content: "Item 2-2",
      },
      {
        content: "Group 2-1",
        items: [{ content: "Item 2-1-1" }, { content: "Item 2-1-2" }],
      },
    ],
  },
];

storiesOf("Components/Tree", module).add("simple", () => (
  <Tree items={items} />
));
