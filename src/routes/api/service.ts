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

import { getClient, fetchServices } from "../../db";

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
