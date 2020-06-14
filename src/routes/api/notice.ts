import * as express from "express";

import {
  query,
  validationResult,
  ValidationChain,
  body,
} from "express-validator";
import {
  validator,
  createResponse,
  access,
  createErrorData,
  createApiError,
  mapData,
  mapKeyToColumn,
  handleRequest,
} from "../../middleware";

import {
  getClient,
  fetchConfig,
  createConfig,
  updateNotice,
  createNotice,
  fetchNoticeWithData,
  deleteNotice,
  fetchNotices,
  updateNoticeData,
  updateNoticeTarget,
  fetchNotice,
  query as dbQuery,
} from "../../db";
import { restartBot, deleteBot, tgBot } from "../../bot";

const router = express.Router();

router.get(
  "/notice/test",
  access.auth,
  [query("noticeId")],
  handleRequest(async (req, res) => {
    const { noticeId } = req.query as any;
    const { userId } = req.session;
    const notice = await fetchNotice(noticeId);
    const users = await dbQuery(
      `SELECT "nickname" FROM "account" WHERE "id"='${userId}'`
    );

    tgBot.sendMessage(users[0].nickname, "Проверка связи...");
    res.send();
  })
);

// Запрос модификации оповещения
router.put(
  "/notice",
  access.auth,
  [query("noticeId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { noticeId, randomId } = req.query as any;
    const {
      values = [],
      queries = [],
      messageTemplate,
      targetKey,
      actionId,
    } = req.body;
    const tasks: Promise<any>[] = [];

    if (values.length > 0 || queries.length > 0)
      tasks.push(updateNoticeData(noticeId, queries, values));

    if (targetKey !== undefined)
      tasks.push(updateNoticeTarget(noticeId, targetKey));

    tasks.push(updateNotice(noticeId, { messageTemplate, actionId }));

    await Promise.all(tasks);

    const configId = (await fetchNotice(noticeId)).config_id;
    await restartBot(configId);
    res.send(createResponse({ randomId }));
  })
);

// Запрос получения оповещения
router.get(
  "/notice",
  access.auth,
  [query("noticeId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { noticeId, randomId } = req.query as any;
    const noticeData = await fetchNoticeWithData(noticeId);
    res.send(createResponse({ ...noticeData, randomId }));
  })
);

// Запрос создания оповещения
router.post(
  "/notice",
  access.auth,
  [query("configId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { configId, randomId } = req.query as any;
    const { messageTemplate = "" } = req.body;
    const result = await createNotice(messageTemplate, configId);
    await restartBot(configId);
    res.send(createResponse({ id: result, randomId }));
  })
);

// router.get(
//   "/notice",
//   access.auth,
//   [query("noticeId").isNumeric()],
//   validator,
//   handleRequest(async (req, res) => {
//     const { noticeId } = req.query as any;
//     const noticeData = await fetchNoticeData(noticeId);
//     res.send(createResponse(noticeData));
//   })
// );

// Запрос получений оповещений, привязанных к сервису
router.get(
  "/notices",
  access.auth,
  [query("configId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { configId } = req.query as any;
    const noticeData = await fetchNotices(configId);
    res.send(createResponse(noticeData));
  })
);

router.delete(
  "/notice",
  access.auth,
  [query("noticeId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { noticeId /* randomId */ } = req.query as any;
    const configId = (await fetchNotice(noticeId)).config_id;
    const noticeData = await deleteNotice(noticeId);

    await restartBot(configId);
    res.send(createResponse({ id: Number(noticeId) /* randomId */ }));
  })
);

export default router;
