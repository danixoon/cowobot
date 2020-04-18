import * as express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("dat is works!");
});

app.listen(3000, () => {
  console.log("server is listening");
});
