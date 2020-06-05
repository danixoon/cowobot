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

import { getClient, fetchServices, fetchServiceConfig } from "../../db";

const router = express.Router();

// router.get("/config")

export default router;

router.get(
  "/services",
  access.auth,
  handleRequest(async (req, res) => {
    const services = await fetchServices();
    res.send(createResponse(services));
  })
);

router.get(
  "/service/config",
  access.auth,
  [query("serviceId")],
  validator,
  handleRequest(async (req, res) => {
    const { serviceId } = req.query as any;
    const { userId } = req.session;

    const config = await fetchServiceConfig(userId, serviceId);
    res.send(createResponse(config));
  })
);
