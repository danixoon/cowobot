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
} from "../../middleware";

import { getClient } from "../../db";

const router = express.Router();

router.get(
  "/services",
  access.auth,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const result = await getClient(
      (client) =>
        client.query(`
        SELECT "service"."id" AS "service_id", "service"."name" FROM "service"
        INNER JOIN "service_type" ON "service_type"."id"="service"."id"
        WHERE "service_type"."type" != 'messenger'
        `),
      next
    );

    res.send(createResponse({ services: mapData(result.rows) }));
  }
);

router.get(
  "/service/configs",
  access.auth,
  [query("serviceId").exists()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const { serviceId } = req.query;

    const configIds = await getClient(
      (client) =>
        client.query(`
        SELECT "service_configuration"."id" from "service_configuration"
        INNER JOIN "service" ON "service"."id"="service_configuration"."service_id"
        WHERE "service_configuration"."account_id"='${userId}' AND "service"."id"='${serviceId}'`),
      next
    );

    return res.send(createResponse(configIds.rows.map((v) => v.id)));
  }
);

router.get(
  "/service/config",
  access.auth,
  [query("configId").exists()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const { configId } = req.query;

    const variables = await getClient(
      (client) =>
        client.query(`
        SELECT "service_configuration_variable"."id" as "variable_id", "service_variable"."name", "service_configuration_variable"."custom_key", "service_variable"."default_key", "service_variable_role"."type" FROM "service_configuration_variable"
        INNER JOIN "service_variable" ON "service_variable"."id"="service_configuration_variable"."variable_id"
        INNER JOIN "service_variable_role" ON "service_variable_role"."id"="service_variable"."role_id"
        WHERE "service_configuration_variable"."configuration_id"='${configId}'
        `),
      next
    );

    const notices = await getClient(
      (client) =>
        client.query(`
        SELECT "id" AS "notice_id", "variable_id", "message_template", "action_id" FROM "service_notification"
        WHERE "configuration_id"='${configId}'
    `),
      next
    );

    const actions = await getClient(
      (client) =>
        client.query(`
        SELECT "service_action"."id" AS "action_id", "service_action"."name" FROM "service_action"
        INNER JOIN "service" ON "service"."type_id"="service_action"."type_id"
        INNER JOIN "service_configuration" ON "service_configuration"."service_id"="service"."id"
        WHERE "service_configuration"."id"='${configId}'
    `),
      next
    );

    return res.send(
      createResponse({
        configId,
        variables: mapData(
          variables.rows.map((v) => ({
            ...v,
            isTarget: v.type === "messenger",
          }))
        ),
        actions: mapData(actions.rows),
        notices: mapData(notices.rows),
      })
    );
  }
);

router.put(
  "/service/config",
  access.auth,
  access.configOwner,
  [query("configId").exists(), body("changes").exists()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { changes, configId } = {
      ...req.body,
      configId: req.query.configId,
    } as ApiRequestData.PUT["/service/config"];

    const queries: string[] = [];

    if (changes.variables) {
      changes.variables.forEach((c) => {
        if (c.customKey == null || c.variableId == null) return;
        queries.push(
          `UPDATE "service_configuration_variable" SET "custom_key"='${c.customKey}' WHERE "id"='${c.variableId}'`
        );
      });
    }

    if (changes.notices) {
      let values = changes.notices
        .filter((v) => v.modified === "delete")
        .map((v) => `'${v.noticeId}'`) as any;

      // Если не предан noticeId - баг
      if (values.length !== 0)
        queries.push(
          `DELETE FROM "service_notification" WHERE "id" IN (${values})`
        );

      if (
        changes.notices.find(
          (c) =>
            c.modified === "create" &&
            ["actionId", "messageTemplate", "variableId"].find((p) => {
              return (c as any)[p] == null;
            })
        )
      )
        return next(
          createApiError({ message: `Invalid notice create values` })
        );

      const updateOrCreateNotices = changes.notices.filter(
        (n) => n.modified === "create" || n.modified === "update"
      );

      if (updateOrCreateNotices.length > 0) {
        const query = `
        SELECT COUNT(*) AS "amount" FROM "service_variable_role"
        INNER JOIN "service_variable" ON "service_variable"."role_id"="service_variable_role"."id"
        WHERE "service_variable_role"."type"!='messenger' AND "service_variable"."id" IN (${updateOrCreateNotices
          .map((v) => `'${v.variableId}'`)
          .join()})
    `;

        const invalidVariables = await getClient(
          (client) => client.query(query),
          next
        );

        if (Number(invalidVariables.rows[0].amount) !== 0)
          return next(
            createApiError({
              message: "Invalid variableId on some notices",
            })
          );
      }

      values = changes.notices
        .filter((v) => v.modified === "create")
        .map(
          (v) =>
            `('${v.actionId}', '${v.messageTemplate}', '${v.variableId}', '${configId}')`
        );

      if (values.length !== 0)
        queries.push(
          `INSERT INTO "service_notification" ("action_id", "message_template", "variable_id", "configuration_id") VALUES ${values.join()}`
        );

      changes.notices
        .filter((v) => v.modified === "update")
        .forEach((change) => {
          const keys = Object.keys(change).filter((c) =>
            ["messageTemplate", "variableId", "actionId"].includes(c)
          );
          if (keys.length !== 0)
            queries.push(
              `UPDATE "service_notification" SET ${keys
                .map((v) => `"${mapKeyToColumn(v)}"='${(change as any)[v]}'`)
                .join()}`
            );
        });
    }

    // res.send(queries);

    const response = await getClient(
      (client) => client.query(queries.join("; ")),
      next
    );

    res.send();

    // const insertQuery = `INSERT INTO variables`
  }
);

router.post(
  "/service/config",
  access.auth,
  [query("serviceId").exists()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const { serviceId } = req.query;

    const {
      rows: [{ amount: configAmount }],
    } = await getClient(
      (client) =>
        client.query(
          `SELECT COUNT(*) AS "amount" FROM "service_configuration" WHERE "account_id"='${userId}' AND "service_id"='${serviceId}'`
        ),
      next
    );

    if (Number(configAmount) >= 1)
      return next(
        createApiError({ message: "Sorry, only one config per service" })
      );

    const serviceTypeResponse = await getClient(
      (client) =>
        client.query(`
        SELECT "service_type"."type" FROM "service_type"
        INNER JOIN "service" ON "service"."type_id"="service_type"."id"
        WHERE "service"."id"='${serviceId}'
        `),
      next
    );

    if (serviceTypeResponse.rowCount === 0)
      return next(
        createApiError({
          message: `Service with <${serviceId}> not exists`,
          statusCode: 404,
        })
      );

    if (serviceTypeResponse.rows[0].type === "messenger")
      return next(
        createApiError({
          message: `Creating config for messenger services not allowed`,
          statusCode: 400,
        })
      );

    const response = await getClient(
      (client) =>
        client.query(`
        INSERT INTO "service_configuration" VALUES 
        (DEFAULT, NULL, NULL, '${userId}', '${serviceId}')
        RETURNING "id"
       `),
      next
    );

    await getClient(
      (client) =>
        client.query(`
        INSERT INTO "service_configuration_variable" ("configuration_id", "variable_id")
        SELECT '${response.rows[0].id}', "service_variable"."id"
        FROM "service_variable"
        WHERE "service_variable"."service_id"='${serviceId}'
    `),
      next
    );

    return res.send(createResponse(mapData(response.rows[0])));
  }
);

router.delete(
  "/service/config",
  access.auth,
  [query("configId").exists()],
  validator,
  async (
    req: SessionRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { userId } = req.session;
    const { configId } = req.query;

    const config = await getClient(
      (client) =>
        client.query(`
        DELETE FROM "service_configuration" WHERE "account_id"='${userId}' AND "id"='${configId}'
      `),
      next
    );

    if (config.rowCount === 0)
      return next(createApiError({ message: "Invalid configId" }));

    return res.send(createResponse({ id: configId }));
  }
);

export default router;
