import * as express from "express";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
  next();
});

export default router;