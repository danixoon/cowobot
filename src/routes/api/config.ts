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
} from "../../db";

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
    res.send(createResponse(result));
  }
);


router.put(
  "/config",
  access.auth,
  [query("configId").isNumeric(), query("token").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { configId, token } = req.query as any;
    const result = await updateConfig(configId, token);
    res.send(createResponse({ id: result }));
  })
);

router.post(
  "/config",
  access.auth,
  [query("accountId").isNumeric(), query("serviceId").isNumeric()],
  validator,
  handleRequest(async (req, res) => {
    const { accountId, serviceId } = req.query as any;
    const result = await createConfig(accountId, serviceId);
    res.send(createResponse({ id: result }));
  })
);

export default router;
