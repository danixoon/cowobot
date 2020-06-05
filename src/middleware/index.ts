import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { check, validationResult, ValidationChain } from "express-validator";
import { getEnv } from "../config";
import { getClient } from "../db";

const { SECRET } = getEnv("SECRET");

export const handleRequest: (
  requestHandler: (
    req: SessionRequest,
    res: express.Response
    // next: express.NextFunction
  ) => Promise<void> | void,
  errorHandler?: (error: any) => ApiError | null | false | undefined
) => express.RequestHandler = (requestHandler, errorHandler) => async (
  req,
  res,
  next
) => {
  try {
    await requestHandler(req as SessionRequest, res);
  } catch (error) {
    let result = null;
    if (errorHandler) result = errorHandler(error);
    if (result != null) {
      // res.send(result);
      next(result);
    } else {
      if (error.response) next(error.response);
      else next(error);
      console.error("Request error: ", error);
    }

    // else throw error;
  }
};

export const mapKeyToColumn = (key: string) =>
  key
    .split("")
    .map((v) => (v.toUpperCase() === v ? `_${v.toLowerCase()}` : v))
    .join("");

export const mapData = <T = any>(data: T): T => {
  if (Array.isArray(data)) return data.map((v) => mapData(v)) as any;
  const mapped = {} as any;
  for (let p in data) {
    const key = p
      .split("_")
      .map((v, i) => (i === 0 ? v : `${v[0].toUpperCase()}${v.substring(1)}`))
      .join("");
    mapped[key] = data[p];
  }
  return mapped;
};

export const createApiError = (error: ApiError) => ({
  response: createErrorData(error),
});

export const createErrorData = ({
  message = "Error",
  statusCode = 400,
  ...rest
}: ApiError) => {
  return { error: { ...rest, message, statusCode } };
};

export const createResponse = (data: any) => ({ data: data ?? null });

export const generateHash = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(value, salt);

  return hash;
};

export const validator: express.RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const param = errors.array()[0].param;
    const message = errors.array()[0].msg;
    return res.status(400).send(
      createErrorData({
        message: `${message} <${param}>`,
        param: param,
        statusCode: 400,
      })
    );
  }

  next();
};

const auth: express.RequestHandler = (req: SessionRequest, res, next) => {
  const token = req.header("Authorization");
  const invalidTokenError = createErrorData({
    message: "invalid token",
    statusCode: 403,
  });
  if (!token) return res.status(403).send(invalidTokenError);
  try {
    const userId = jwt.verify(token, SECRET) as string;
    if (!req.session) req.session = { userId };
    next();
  } catch (error) {
    return res.status(403).send(invalidTokenError);
  }
};

const configOwner: express.RequestHandler = async (
  req: SessionRequest,
  res,
  next
) => {
  const { configId } = req.query;
  const { userId } = req.session;

  if (configId == null)
    return next(
      createApiError({
        message: "Invalid configId",
        statusCode: 400,
        param: "configId",
      })
    );

  const config = await getClient(
    (client) =>
      client.query(
        `SELECT "account_id" FROM "service_configuration" WHERE "id"='${configId}' AND "account_id"='${userId}'`
      ),
    next
  );

  if (config.rowCount === 0)
    return next(createApiError({ message: "Access denied", statusCode: 402 }));
  next();
};

const guest: express.RequestHandler = (req, res, next) => {
  if (req.header("Authorization"))
    return res
      .status(402)
      .send(createErrorData({ message: "You need to logout" }));
  next();
};

export const access = { guest, configOwner, auth };
