import * as express from "express";
import { validationResult, ValidationChain, query } from "express-validator";
import {
  access,
  createResponse,
  validator,
  generateHash,
  mapData,
  handleRequest,
} from "../../middleware";
import {
  getClient,
  resetDatabase,
  fetchNoticeWithData,
  createNotice,
  createConfig,
  fetchConfig,
  updateNotice,
  updateNoticeData,
  fetchNotice,
  query as dbQuery,
} from "../../db";

const router = express.Router();

const randomString = () =>
  Math.random().toString(16).substring(2, 7) +
  Math.random().toString(16).substring(2, 7);

router.post(
  "/admin/user",
  [query("username").isString(), query("nickname").isString()],
  validator,
  handleRequest(async (req, res: express.Response) => {
    const { username, nickname, password } = req.query as any;
    const pass = password || randomString();

    const hash = await generateHash(pass);

    await dbQuery(
      `INSERT INTO "account" VALUES (DEFAULT, '${username}', '${hash}', '${nickname}', '${1}')`
    );

    res.send(
      createResponse({
        username,
        password: pass,
      })
    );
  })
);

router.delete(
  "/admin/user",
  [query("username").isString()],
  validator,
  handleRequest(async (req, res: express.Response) => {
    const { username } = req.query as any;

    await dbQuery(`DELETE FROM "account" WHERE "username"='${username}'`);

    res.send();
  })
);

router.get("/admin/db/reset", async (req, res, next) => {
  await resetDatabase();
  res.send();
});

export default router;
