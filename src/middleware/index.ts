import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { check, validationResult, ValidationChain } from "express-validator";
import { getEnv } from "../config";

const { SECRET } = getEnv("SECRET");

type ApiError = Partial<{
  message: string;
  statusCode: number;
  [key: string]: any;
}>;

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

export const createResponse = (data: any) => ({ data });

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

export type SessionRequest = express.Request & { session: { userId?: string } };

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

const guest: express.RequestHandler = (req, res, next) => {
  if (req.header("Authorization"))
    return res
      .status(402)
      .send(createErrorData({ message: "You need to logout" }));
  next();
};

export const access = { guest, auth };
