import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";
import { useInput } from "../../hooks/useInput";
import Label from "../Label";

storiesOf("Components/Input", module)
  .add("simple", () => <Input name="simple" input={{}} placeholder="текст" />)
  .add("with reset", () => {
    const bindInput = useInput();
    return (
      <>
        <Input
          {...bindInput}
          name="resetable"
          isResetable
          placeholder="текст"
          defaultValue="BB_PR_REVIEWER"
        />

        <Input {...bindInput} name="text2" isResetable placeholder="текст" />
      </>
    );
  })
  .add("with label", () => {
    // const [input, bind, setInput] = useInput({});
    return (
      <Label text="Лейбл">
        <Input
          name="revieverName"
          input={{}}
          defaultValue="BB_PR_REVIEWER"
          placeholder="текст"
        />
      </Label>
    );
  })
  .add("with dropdown", () => {
    const bindInput = useInput({ dropdown: "при" });
    return (
      <Input
        {...bindInput}
        name="dropdown"
        defaultValue="прив"
        placeholder="текст"
        isResetable
        isDropdown
        dropdownItems={["Привет", "Пока", "Призрак"]}
      />
    );
  });
