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
  fetchNoticeData,
  deleteNotice,
  fetchNotices,
} from "../../db";

const router = express.Router();

// Запрос модификации оповещения
router.put(
  "/notice",
  access.auth,
  [query("noticeId").isNumeric()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { messageTemplate, noticeId } = req.query as any;
    const result = await updateNotice(noticeId, messageTemplate);
    res.send(createResponse(result));
  }
);

// Запрос создания оповещения
router.post(
  "/notice",
  access.auth,
  [query("actionId").isNumeric(), query("configId").isNumeric()],
  validator,
  handleRequest(
    async (req, res) => {
      const { messageTemplate = "", actionId, configId } = req.query as any;
      const result = await createNotice(messageTemplate, configId, actionId);
      res.send(createResponse({ id: result }));
    },
    (error) =>
      error.code === "23503" &&
      createApiError({ message: "Некорректный actionId" })
  )
);

// Запрос получения оповещения
router.get(
  "/notice/data",
  access.auth,
  [query("noticeId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { noticeId } = req.query as any;
    const noticeData = await fetchNoticeData(noticeId);
    res.send(createResponse(noticeData));
  })
);

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
    const { noticeId } = req.query as any;
    const noticeData = await deleteNotice(noticeId);
    res.send(createResponse(noticeData));
  })
);

export default router;
