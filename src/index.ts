import * as express from "express";
import { loadConfig } from "./config";

loadConfig("development");

const { PORT } = process.env;

const app = express();

app.get("/test", (req, res) => {
  res.send(Math.random() > 0.5 ? "ok" : "not ok");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
