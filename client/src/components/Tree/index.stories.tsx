import { storiesOf } from "@storybook/react";
import React from "react";
import Input from ".";
import { InputWrapper } from "../../wrappers/InputWrapper";
import { useInput } from "../../hooks/useInput";

storiesOf("Components/Input", module)
  .add("simple", () => <Input placeholder="текст" />)
  .add("with reset", () => {
    const [input, bind, setInput] = useInput();
    return (
      <>
        <InputWrapper name="text1" setInput={setInput} input={input} {...bind}>
          <Input
            isResetable
            placeholder="текст"
            defaultValue="BB_PR_REVIEWER"
          />
        </InputWrapper>
        <InputWrapper name="text2" setInput={setInput} input={input} {...bind}>
          <Input isResetable placeholder="текст" />
        </InputWrapper>
      </>
    );
  })
  .add("with label", () => (
    <Input
      defaultValue="BB_PR_REVIEWER"
      placeholder="текст"
      label="Имя ревьювера"
    />
  ))
  .add("with dropdown", () => {
    const [input, bind, setInput] = useInput({ dropdown: "при" });
    return (
      <InputWrapper name="dropdown" input={input} setInput={setInput} {...bind}>
        <Input
          defaultValue="прив"
          placeholder="текст"
          isResetable
          isDropdown
          dropdownItems={["Привет", "Пока", "Призрак"]}
          label="Выпадающий список"
        />
      </InputWrapper>
    );
  });
