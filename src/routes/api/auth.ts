import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { query, validationResult, ValidationChain } from "express-validator";
import {
  validator,
  createResponse,
  access,
  SessionRequest,
  createErrorData,
  createApiError,
} from "../../middleware";
import { getEnv } from "../../config";
import { getClient } from "../../db";

const { SECRET } = getEnv("SECRET");

const router = express.Router();

router.get(
  "/auth",
  access.guest,
  [query("username").isString(), query("password").isString()],
  validator,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { username, password } = req.query;
    const invalidCredintalsError = createApiError({
      message: "Invalid username or password",
      statusCode: 403,
    });
    const result = await getClient(
      (client) =>
        client.query(
          `SELECT "id", "password_hash" FROM "account" WHERE "username"='${username}'`
        ),
      next
    );

    if (result.rowCount === 0) return next(invalidCredintalsError);
    const [{ password_hash, id }] = result.rows;
    const correct = await bcrypt.compare(password, password_hash);
    if (!correct) return next(invalidCredintalsError);

    const token = jwt.sign(id, SECRET);

    res.send(createResponse({ token }));
  }
);

// TODO
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
