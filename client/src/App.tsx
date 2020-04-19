import React, { useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

function App() {
  const [status, setStatus] = useState(() => null);

  const handleTest = async () => {
    const result = await axios.get("/test");
    console.log(result);
    setStatus(result.data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleTest}>{status || ""}</button>
      </header>
    </div>
  );
}

export default App;
