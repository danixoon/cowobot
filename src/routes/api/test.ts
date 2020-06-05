import * as express from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import {
  access,
  createResponse,
  validator,
  generateHash,
  mapData,
} from "../../middleware";
import {
  getClient,
  resetDatabase,
  fetchNoticeData,
  createNotice,
  createConfig,
  fetchConfig,
  updateNotice,
  updateNoticeData,
  fetchNotice,
} from "../../db";

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ ok: true });
});

router.get("/test/auth", access.auth, (req: SessionRequest, res, next) => {
  res.send(createResponse({ userId: req.session.userId }));
});

router.get("/test/db/reset", async (req, res, next) => {
  await resetDatabase();
  res.send();
});

router.get("/test/db/notice", async (req, res, next) => {
  const { noticeId } = req.query as any;
  const noticeData = await fetchNoticeData(noticeId);
  res.send(createResponse(noticeData));
});

router.post("/test/db/notice", async (req, res, next) => {
  const { messageTemplate, actionId, configId } = req.query as any;
  const result = await createNotice(messageTemplate, configId, actionId);
  res.send(createResponse(result));
});

router.post("/test/db/config", async (req, res, next) => {
  const { accountId, serviceId } = req.query as any;
  const result = await createConfig(accountId, serviceId);
  res.send(createResponse(result));
});

router.get("/test/db/config", async (req, res, next) => {
  const result = await fetchConfig(req.query.configId as any);
  res.send(createResponse(result));
});

router.put("/test/db/notice", async (req, res, next) => {
  const { messageTemplate, noticeId } = req.query as any;
  const result = await updateNotice(noticeId, messageTemplate);
  res.send(createResponse(result));
});

// router.get("/test/db/notice", async (req, res, next) => {
//   const { noticeId } = req.query as any;
//   const result = await fetchNotice(noticeId);
//   res.send(createResponse(result));
// });

router.put("/test/db/notice/data", async (req, res, next) => {
  const { noticeId } = req.query as any;
  const { values, queries } = req.body;
  await updateNoticeData(noticeId, queries, values);
  res.send();
});

router.get("/test/data", (req, res, next) => {
  const sampleData = mapData({ id: 0, test_id: 1, test_key: "key" });
  const sampleArray = mapData([{ id: 0, test_id: 1, test_key: "key" }]);

  res.send(createResponse({ sampleArray, sampleData }));
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
