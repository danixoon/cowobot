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
          { content: "Item 1-1-1", id: "item-1" },
          { content: "Item 1-1-2", id: "item-2" },
          { content: "Item 1-1-3", id: "item-3" },
        ],
      },
      {
        content: "Group 1-2",
        items: [{ content: "Item 1-2-1", id: "item-4" }],
      },
      {
        content: "Item 1-1",
        id: "item-5",
      },
    ],
  },
  {
    content: "Group 2",
    items: [
      {
        content: "Item 2-1",
        id: "item-6",
      },
      {
        content: "Item 2-2",
        id: "item-7",
      },
      {
        content: "Group 2-1",
        items: [
          { content: "Item 2-1-1", id: "item-8" },
          { content: "Item 2-1-2", id: "item-9" },
        ],
      },
    ],
  },
];

storiesOf("Components/Tree", module).add("simple", () => (
  <Tree
    onItemSelect={(id) => console.log(`Selected item with id <${id}>`)}
    style={{ maxWidth: 150, backgroundColor: "#F8F8F8" }}
    items={items}
  />
));
