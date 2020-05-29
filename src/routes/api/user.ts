import * as express from "express";

import { query, validationResult, ValidationChain } from "express-validator";
import {
  validator,
  createResponse,
  access,
  SessionRequest,
  createErrorData,
  createApiError,
} from "../../middleware";

import { getClient } from "../../db";

const router = express.Router();

router.get(
  "/user",
  access.auth,

  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const result = await getClient(
      (client) =>
        client.query(`SELECT "username" FROM "account" WHERE "id"='${userId}'`),
      next
    );

    res.send(createResponse({ ...result.rows[0] }))
  }
);

export default router;
