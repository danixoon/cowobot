import * as express from "express";
import * as path from "path";
import { loadConfig, getEnv, nodeEnvType } from "./config";

loadConfig();

import apiRouter from "./routes/api";

const { PORT, NODE_ENV } = getEnv("PORT", "NODE_ENV");

const app = express();

if (NODE_ENV === nodeEnvType.production) {
  app.use("/*", express.static(path.resolve(__dirname, "../client/build")));
}

app.use(apiRouter);

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
