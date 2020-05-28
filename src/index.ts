import * as express from "express";
import * as path from "path";
import { loadConfig, getEnv, nodeEnvType } from "./config";

import apiRouter from "./routes/api";

loadConfig();

const { PORT, NODE_ENV } = getEnv("PORT", "NODE_ENV");

const app = express();

if (NODE_ENV === nodeEnvType.production) {
  app.use("/", express.static(path.resolve(__dirname, "../client/build")));
}
  
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
