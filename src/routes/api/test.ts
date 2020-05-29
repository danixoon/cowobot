import * as express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import {
  access,
  SessionRequest,
  createResponse,
  validator,
  generateHash,
} from "../../middleware";
import { getClient } from "../../db";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
});

router.get("/test/auth", access.auth, (req: SessionRequest, res, next) => {
  res.send(createResponse({ userId: req.session.userId }));
});

router.get("/test/users", async (req, res, next) => {
  const data = await getClient(
    (client) => client.query(`SELECT * FROM "account"`),
    next
  );
  res.send(createResponse(data.rows));
});

router.get(
  "/test/password-hash",
  [query("password").isString()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.send(
      createResponse({ hash: await generateHash(req.query.password as string) })
    );
  }
);

export default router;
