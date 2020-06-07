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
  updateConfig,
  fetchServiceConfig,
  deleteConfig,
} from "../../db";
import { restartBot, startBot, deleteBot } from "../../bot";

const router = express.Router();

router.get(
  "/config",
  access.auth,
  [query("configId").isNumeric()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const result = await fetchConfig(req.query.configId as any);
    res.send(createResponse(mapData(result)));
  }
);

router.put(
  "/config",
  access.auth,
  [query("configId").isNumeric(), body("token").exists()],
  validator,
  handleRequest(async (req, res) => {
    const { configId } = req.query as any;
    const { token } = req.body;
    const result = await updateConfig(configId, token);
    await restartBot(configId);
    res.send(createResponse({ id: result }));
  })
);

router.post(
  "/config",
  access.auth,
  [query("serviceId").isNumeric()],
  validator,
  handleRequest(
    async (req, res) => {
      const { userId } = req.session;
      const { serviceId } = req.query as any;
      const config = await createConfig(userId, serviceId);
      await startBot(config.id);
      res.send(createResponse({ id: config.id }));
    }
    // (error) =>
    //   error.code === "23505" &&
    //   createApiError({
    //     message: "Невозможно создать две конфигурации на один аккаунт.",
    //   })
  )
);

router.delete(
  "/config",
  access.auth,
  [query("configId").isNumeric()],
  validator,
  // access.configOwner,
  handleRequest(
    async (req, res) => {
      // const { userId } = req.session;
      const { configId } = req.query as any;
      const config = await deleteConfig(configId);

      await deleteBot(configId);
      res.send(createResponse({ id: config.id }));
    }
    // (error) =>
    //   error.code === "23505" &&
    //   createApiError({
    //     message: "Невозможно создать две конфигурации на один аккаунт.",
    //   })
  )
);

export default router;
