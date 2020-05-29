import * as express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import {
  access,
  SessionRequest,
  createResponse,
  validator,
  generateHash,
} from "../../middleware";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
  next();
});

router.get("/test/auth", access.auth, (req: SessionRequest, res, next) => {
  res.send(createResponse({ userId: req.session.userId }));
  next();
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
    next();
  }
);

export default router;
