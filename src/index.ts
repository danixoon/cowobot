import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as pg from "pg";
import { loadConfig, getEnv, nodeEnvType } from "./config";

loadConfig();

import { pool } from "./db";
import apiRouter from "./routes/api";
import { createErrorData } from "./middleware";
import { setupBots } from "./bot";

const { PORT, NODE_ENV, DATABASE_URL } = getEnv(
  "PORT",
  "NODE_ENV",
  "DATABASE_URL"
);

const errorRequestHandler: express.ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);
  const statusCode = err.response?.error.statusCode ?? 500;
  res
    .status(statusCode)
    .send(
      err.response ?? createErrorData({ message: "Internal error", statusCode })
    );
};

const init = async () => {
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  const app = express();

  if (NODE_ENV === nodeEnvType.production) {
    app.use("/*", express.static(path.resolve(__dirname, "../client/build")));
  }

  app.use(bodyParser.json());
  app.use(apiRouter);
  app.use(errorRequestHandler);

  await setupBots();

  app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
  });
};

init();
