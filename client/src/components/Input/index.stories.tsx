import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";
import { InputWrapper } from "../../wrappers/InputWrapper";
import { useInput } from "../../hooks/useInput";

storiesOf("Components/Input", module)
  .add("simple", () => <Input name="simple" input={{}} placeholder="текст" />)
  .add("with reset", () => {
    const [input, bind, setInput] = useInput();
    return (
      <>
        <Input
          name="resetable"
          setInput={setInput}
          input={input}
          {...bind}
          isResetable
          placeholder="текст"
          defaultValue="BB_PR_REVIEWER"
        />

        <Input
          name="text2"
          setInput={setInput}
          input={input}
          {...bind}
          isResetable
          placeholder="текст"
        />
      </>
    );
  })
  .add("with label", () => {
    // const [input, bind, setInput] = useInput({});
    return (
      <Input
        name="revieverName"
        input={{}}
        defaultValue="BB_PR_REVIEWER"
        placeholder="текст"
        label="Имя ревьювера"
      />
    );
  })
  .add("with dropdown", () => {
    const [input, bind, setInput] = useInput({ dropdown: "при" });
    return (
      <Input
        {...bind}
        name="dropdown"
        setInput={setInput}
        input={input}
        defaultValue="прив"
        placeholder="текст"
        isResetable
        isDropdown
        dropdownItems={["Привет", "Пока", "Призрак"]}
        label="Выпадающий список"
      />
    );
  });
