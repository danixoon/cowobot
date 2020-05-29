import * as express from "express";

import authRouter from "./auth";
import testRouter from "./test";

const router = express.Router();

router.use("/api", authRouter, testRouter);

export default router;
