import * as React from "react";
import "../../sass/theme.scss";
import DialogPopup from "../../components/DialogPopup";
import Form from "../../components/Form";
import Button from "../../components/Button";

interface RootProps {}

const Root: React.FC<RootProps> = (props) => (
  <>
    <DialogPopup onSubmit={() => {}} onAbort={() => {}}>
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
    я за попапом
  </>
);

export default Root;
