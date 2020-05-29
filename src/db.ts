import * as pg from "pg";
import { loadConfig, getEnv, nodeEnvType } from "./config";
import { NextFunction } from "express";
import { createErrorData } from "./middleware";

const { DATABASE_URL } = getEnv("DATABASE_URL");

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const getClient = <T = any>(
  cb: (client: pg.PoolClient) => T | Promise<T>,
  next: NextFunction
) => {
  return new Promise<ReturnType<typeof cb>>(async (res, rej) => {
    try {
      const client = await pool.connect();
      const data = await cb(client);
      client.release();
      res(data);
    } catch (err) {
      next(err);
    }
  });
};
