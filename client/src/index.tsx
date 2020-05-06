import * as React from "react";
import * as ReactDOM from "react-dom";
import RootComponent from "../components/Root";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.render(<RootComponent />, rootElement);
