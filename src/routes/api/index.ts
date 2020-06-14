import * as express from "express";

import authRouter from "./auth";
import userRouter from "./user";
import configRouter from "./config";
import serviceRouter from "./service";
import noticeRouter from "./notice";
import adminRouter from "./admin";
import testRouter from "./test";
import { createErrorData } from "../../middleware";

const router = express.Router();

const handleNotFound: express.RequestHandler = (req, res, next) => {
  next({
    response: createErrorData({
      message: "Method not found (???)",
      statusCode: 404,
    }),
  });
};

router.use(
  "/api",
  authRouter,
  userRouter,
  serviceRouter,
  configRouter,
  noticeRouter,
  adminRouter,
  testRouter,
  handleNotFound
);

export default router;
