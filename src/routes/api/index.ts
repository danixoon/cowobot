import * as express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import { validator } from "../../middleware";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
  next();
});

router.get(
  "/auth",
  [query("username").isString(), query("password").isString()],
  validator,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send(req.query);
    next();
  }
);

export default router;
