import * as express from "express";
import { loadConfig } from "./config";

loadConfig("development");

const { PORT } = process.env;

const app = express();

app.get("/", (req, res) => {
  res.send("Dat is works!");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
