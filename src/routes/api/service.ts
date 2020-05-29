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
  "/service",
  access.auth,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const result = await getClient(
      (client) =>
        client.query(`
        SELECT "service"."id", "service"."name" FROM "service"
        INNER JOIN "service_type" ON "service_type"."id"="service"."id"
        WHERE "service_type"."type" != 'messenger'
        `),
      next
    );

    res.send(createResponse({ services: result.rows }));
  }
);

export default router;
