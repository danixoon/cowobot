import * as express from "express";

import authRouter from "./auth";
import testRouter from "./test";
import { createErrorData } from "../../middleware";

const router = express.Router();

const handleNotFound: express.RequestHandler = (req, res, next) => {
  next({
    response: createErrorData({ message: "Method not found", statusCode: 404 }),
  });
};

router.use("/api", authRouter, testRouter, handleNotFound);

export default router;
