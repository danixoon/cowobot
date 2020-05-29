import * as express from "express";
import { access, SessionRequest, createResponse } from "../../middleware";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
  next();
});

router.get("/test-auth", access.auth, (req: SessionRequest, res, next) => {
  res.send(createResponse({ userId: req.session.userId }));
});

export default router;
