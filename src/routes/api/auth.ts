import * as express from "express";
import * as jwt from "jsonwebtoken";
import { query, validationResult, ValidationChain } from "express-validator";
import {
  validator,
  createResponse,
  access,
  SessionRequest,
} from "../../middleware";
import { getEnv } from "../../config";

const { SECRET } = getEnv("SECRET");

const router = express.Router();

router.get(
  "/auth",
  access.guest,
  [query("username").isString(), query("password").isString()],
  validator,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username, password } = req.query;

    const token = jwt.sign("id123", SECRET);

    res.send(createResponse({ token }));
    next();
  }
);

router.post(
  "/auth",
  access.guest,
  [
    query("fullname").isString,
    query("username").isString(),
    query("password").isString(),
  ],
  validator,
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {}
);

export default router;
