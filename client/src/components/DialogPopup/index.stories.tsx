import { storiesOf } from "@storybook/react";
import React from "react";
import DialogPopup from ".";
import Form from "../Form";
import Button from "../Button";
import PopupLayoutProvider from "../../providers/PopupLayoutProvider";

storiesOf("Components/Dialog Popup", module).add("simple", () => (
  <PopupLayoutProvider>
    <DialogPopup onSubmit={() => {}} onReset={() => {}}>
      <Form
        preventDefault
        style={{
          backgroundColor: "white",
          alignItems: "center",
          padding: "1rem",
          borderRadius: "5px",
        }}
      >
        <p> Как ты? </p>
        <div>
          <Button color="primary">Нормально</Button>
          <Button color="secondary">Фигово</Button>
        </div>
      </Form>
    </DialogPopup>
  </PopupLayoutProvider>
));
