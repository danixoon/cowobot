import * as express from "express";
import { check, validationResult, ValidationChain } from "express-validator";

export const validator: express.RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).send({
      error: {
        message: errors.array()[0].msg,
        param: errors.array()[0].param,
        statusCode: 400,
      },
    });

  next();
};
