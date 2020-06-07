import * as pg from "pg";
import { loadConfig, getEnv, nodeEnvType } from "./config";
import { NextFunction } from "express";
import { createErrorData, mapData, createApiError } from "./middleware";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";

const { DATABASE_URL } = getEnv("DATABASE_URL");

export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const getClient = <T = any>(
  cb: (client: pg.PoolClient) => T | Promise<T>,
  next?: NextFunction
) => {
  return new Promise<ReturnType<typeof cb>>(async (res, rej) => {
    try {
      const client = await pool.connect();
      const data = await cb(client);
      client.release();
      res(data);
    } catch (err) {
      // if (next) next(err);
      // else rej(err);

      console.error("Query error: ", err);
      rej(err);
    }
  });
};

export namespace DBSchema {
  export type IConfig = {
    id: number;
    token: string | null;
    account_id: number;
    service_id: number;
  };

  export type INotice = {
    id: number;
    message_template: string;
    config_id: number;

    action_id: number;
    service_id: number;
  };
  export type INoticeValue = {
    name: string;
    key: string;
    value: string;
  };
  export type INoticeQuery = {
    name: string;
    custom_key: string;
    key: string;
    role: QueryRole;
  };

  export type IAction = {
    id: number;
    name: string;
    key: string;
    values: INoticeValue[];
    queries: INoticeQuery[];
  };

  export type IServiceSchema = {
    id: number;
    name: string;
    key: string;
    role: number;
    actions: IAction[];
  };
}

// const noticeDataMap = new Map()
enum ServiceRole {
  Messenger = 1 << 1,
  Event = 1 << 2,
}

enum QueryRole {
  Messenger = 1 << 1,
  Text = 1 << 2,
}

const services: DBSchema.IServiceSchema[] = [
  {
    id: 0,
    name: "Вконтакте",
    key: "vk",
    role: ServiceRole.Event | ServiceRole.Messenger,
    actions: [
      {
        id: 0,
        name: "Сообщение группы",
        key: "group_message",
        values: [
          {
            name: "Ид. получателя",
            key: "target_id",
            value: "",
          },
        ],
        queries: [
          {
            name: "Содержимое сообщения",
            custom_key: "",
            key: "content",
            role: QueryRole.Text,
          },
          {
            name: "Автор сообщения",
            custom_key: "",
            key: "username",
            role: QueryRole.Text,
          },
        ],
      },
      {
        id: 0,
        name: "Новый комментарий",
        key: "post_comment_new",
        queries: [
          {
            key: "post_comment",
            name: "Комментарий",
            custom_key: "",
            role: QueryRole.Text,
          },
        ],
        values: [],
      },
    ],
  },
  {
    id: 0,
    name: "GitHub",
    key: "github",
    role: ServiceRole.Event,
    actions: [
      {
        id: 0,
        name: "Новый запрос PR",
        key: "pr_new",
        queries: [],
        values: [],
      },
    ],
  },
];

export const getAction = (serviceKey: string, actionKey: string) => {
  return services
    .find((service) => service.key === serviceKey)
    .actions.find((action) => action.key === actionKey);
};

export const query = async (query: string) => {
  const rows = (await getClient((client) => client.query(query))).rows;
  return rows;
};

export const getActionByNoticeId = async (noticeId: number) => {
  const { serviceKey, actionKey } = (
    await getClient((client) =>
      client.query(`
      SELECT "action"."key" AS "actionKey", "service"."key" AS "serviceKey" FROM "notice"
      INNER JOIN "action" ON "action"."id"="notice"."action_id"
      INNER JOIN "service" ON "service"."id"="notice"."service_id"
  WHERE "notice"."id"='${noticeId}'
  `)
    )
  ).rows[0] as any;

  return getAction(serviceKey, actionKey);
};

const accounts = [
  {
    username: "danixoon",
    nickname: "danixoon",
    password: "$2b$10$1N3RfmrbnJ/9xxfdmAv3/ezsyiSPvGjrtWmF6tbx8mAA1.wtjBPE6",
  },
];

export const getInsertQuery = (
  table: string,
  values: string[],
  returns?: string | undefined
) => {
  return `INSERT INTO "${table}" VALUES ${values
    .map((items) => `(${items})`)
    .join()} ${returns ? `RETURNING ${returns}` : ""}`;
};

export const getIdByCondition = async (
  table: string,
  conditon: string
): Promise<null | number> => {
  const result = await getClient((client) =>
    client.query(`SELECT "id" FROM "${table}" WHERE ${conditon}`)
  );
  if (result.rowCount === 0) return null;
  else return result.rows[0].id as number;
};

export const getColumnsByCondition = async (
  table: string,
  fields: string[],
  conditon: string
): Promise<any[]> => {
  const result = await getClient((client) =>
    client.query(
      `SELECT "${fields.join(`" , "`)}" FROM "${table}" WHERE ${conditon}`
    )
  );
  return result.rows;
};

export const getAllColumnsByCondition = async (
  table: string,
  conditon: string
): Promise<any[]> => {
  const result = await getClient((client) =>
    client.query(`SELECT * FROM "${table}" WHERE ${conditon}`)
  );
  return result.rows;
};

// export const getConfigId

export const resetDatabase = async () => {
  const query = await util.promisify(fs.readFile)(
    path.resolve(__dirname, "./sql/reset.sql"),
    {
      encoding: "utf-8",
    }
  );
  await getClient((client) => client.query(query));

  const dbServices = await getClient((client) =>
    client.query(
      getInsertQuery(
        "service",
        services.map((v) => `DEFAULT, '${v.name}', '${v.key}', '${v.role}'`),
        `"id"`
      )
    )
  );

  const dbActions = await getClient((client) =>
    client.query(
      getInsertQuery(
        "action",
        services.flatMap((service, i) =>
          service.actions.map(
            (action) =>
              `DEFAULT, '${action.name}', '${action.key}', '${dbServices.rows[i].id}'`
          )
        ),
        `"id"`
      )
    )
  );

  const dbAccounts = await getClient((client) =>
    client.query(
      getInsertQuery(
        "account",
        accounts.map(
          (account) =>
            `DEFAULT, '${account.username}', '${account.password}', '${account.nickname}', ${dbServices.rows[0].id}`
        )
      )
    )
  );
};

export const fetchServices = async () => {
  const services = await getClient((client) =>
    client.query(`SELECT * FROM "service"`)
  );
  const actions = await Promise.all(
    services.rows.map((service: IService) =>
      getAllColumnsByCondition("action", `"service_id"='${service.id}'`)
    )
  );

  return services.rows.map((service, i) =>
    mapData({
      ...service,
      actions: mapData(actions[i]),
    })
  );
};

// Возвращает все идентификаторы оповещений, привязанных к конфигу configId
export const fetchNotices = async (configId: number) => {
  const notices = await getAllColumnsByCondition(
    "notice",
    `"config_id"='${configId}'`
  );

  return mapData(notices);
};

export const fetchServiceConfig = async (
  accountId: number,
  serviceId: number
) => {
  return (
    await getAllColumnsByCondition(
      "config",
      `"account_id"='${accountId}' AND "service_id"='${serviceId}'`
    )
  )[0];
};

// Возвращает конфигурацию по ид.
export const fetchConfig = async (configId: number) => {
  const config = await getAllColumnsByCondition("config", `"id"='${configId}'`);

  return config[0];
};

export const deleteNotice = async (noticeId: number) => {
  return await getClient((client) =>
    client.query(`DELETE FROM "notice" WHERE "id"='${noticeId}'`)
  );
};

// export const fetchNoticeData = async (noticeId: number) => {};

// Возвращает данные по оповещению
export const fetchNoticeWithData = async (noticeId: number) => {
  const notice = (
    await getAllColumnsByCondition("notice", `"id"='${noticeId}'`)
  )[0];

  if (!notice) return null;

  const [values, queries, target] = (await Promise.all([
    getAllColumnsByCondition("notice_value", `"notice_id"='${noticeId}'`),
    getAllColumnsByCondition("notice_query", `"notice_id"='${noticeId}'`),
    getAllColumnsByCondition(
      "notice_target",
      `"notice_id"='${noticeId}' AND "action_id"='${notice.action_id}'`
    ),
  ])) as any;

  const action = await getActionByNoticeId(noticeId);

  // const targetKey =

  return {
    ...mapData(notice),
    values: mapData(mergeByKey(action.values, values)),
    queries: mapData(mergeByKey(action.queries, queries)),
    targetKey: target[0]?.target_key ?? null,
  };

  // const

  // const mappedValues =

  // const config = await getAllColumnsByCondition("config", `"id"='${configId}'`);

  // return config[0];
};

export const createNotice = async (
  messageTemplate: string,
  configId: number
) => {
  const config = (
    await getColumnsByCondition("config", ["service_id"], `"id"='${configId}'`)
  )[0];

  const action = (
    await getAllColumnsByCondition(
      "action",
      `"service_id"='${config.service_id}'`
    )
  )[0];

  const notice = (
    await getClient((client) =>
      client.query(
        getInsertQuery(
          "notice",
          [
            `DEFAULT, '${messageTemplate}', '${configId}', '${action.id}', '${config.service_id}'`,
          ],
          `"id"`
        )
      )
    )
  ).rows[0];
  return notice.id;
};

export const updateNotice = async (
  noticeId: number,
  data: {
    messageTemplate?: string;
    actionId?: string;
  }
) => {
  const values: string[] = [];
  if (data.messageTemplate)
    values.push(`"message_template"='${data.messageTemplate}'`);
  if (data.actionId) values.push(`"action_id"='${data.actionId}'`);

  if (values.length > 0)
    await getClient((client) =>
      client.query(
        `UPDATE "notice" SET ${values.join()} WHERE "id"='${noticeId}'`
      )
    );
};

// export const getConfigIdByNotic

// Объединяет значение А со значение Б, если в значении Б присутствует ключ в элемете значения А
const mergeByKey = <A extends { key: any }, B extends { key: any }>(
  valueA: A[],
  valueB: B[]
) => {
  const merged = valueA.map((query) => ({
    ...query,
    ...(valueB.find((q) => q.key === query.key) ?? {}),
  }));
  return merged as (A & B)[];
};

export const updateNoticeTarget = async (
  noticeId: number,
  targetKey: string | null
) => {
  const notices = await getAllColumnsByCondition(
    "notice",
    `"id"='${noticeId}'`
  );
  const actionId = notices[0].action_id;
  const noticeTarget = await getAllColumnsByCondition(
    "notice_target",
    `"action_id"='${actionId}' AND "notice_id"='${noticeId}'`
  );
  // Уже сохранена цель
  if (noticeTarget.length > 0) {
    const query = `UPDATE "notice_target" SET "target_key"=${
      targetKey == null ? `NULL` : `'${targetKey}'`
    } WHERE "action_id"='${actionId}' AND "notice_id"='${noticeId}'`;
    await getClient((client) => client.query(query));
  } else {
    const query = `INSERT INTO "notice_target"("target_key", "action_id", "notice_id") VALUES (${
      targetKey == null ? "NULL" : `'${targetKey}'`
    }, '${actionId}', '${noticeId}')`;
    await getClient((client) => client.query(query));
  }
};

export const updateNoticeData = async (
  noticeId: number,
  queries: { id?: number; key: string; customKey: string }[],
  values: { id?: number; key: string; value: string }[]
) => {
  const action = await getActionByNoticeId(noticeId);
  const mergedQueries = mergeByKey(mapData(action.queries), queries);
  const mergedValues = mergeByKey(mapData(action.values), values);

  const query1 =
    getInsertQuery(
      "notice_query",
      mergedQueries.map(
        (query) =>
          `${query.id ?? "DEFAULT"}, '${query.name}', '${query.key}', '${
            query.customKey
          }', ${query.role} , '${noticeId}'`
      )
    ) +
    `ON CONFLICT ("key", "notice_id") DO UPDATE SET "custom_key" = excluded."custom_key"`;
  const query2 =
    getInsertQuery(
      "notice_value",
      mergedValues.map(
        (value) =>
          `${value.id ?? "DEFAULT"}, '${value.name}', '${value.key}', '${
            value.value
          }', '${noticeId}'`
      )
    ) +
    `ON CONFLICT ("key", "notice_id") DO UPDATE SET "value" = excluded."value"`;

  const query: string[] = [];

  if (mergedQueries.length > 0) query.push(query1);
  if (mergedValues.length > 0) query.push(query2);

  console.warn(query);
  if (query.length > 0)
    await getClient((client) => client.query(query.join("; ")));

  // )`INSERT INTO "notice_query" (machine_id, machine_name)VALUES (1, 1, 'test_machine')
  // ON DUPLICATE KEY UPDATE machine_name=VALUES(machine_name);`;
};

export const createConfig = async (accountId: number, serviceId: number) => {
  const config = (
    await getClient((client) =>
      client.query(
        getInsertQuery(
          "config",
          [`DEFAULT, NULL, '${accountId}', '${serviceId}'`],
          `"id"`
        )
      )
    )
  ).rows[0];
  return config;
};

export const deleteConfig = async (configId: number) => {
  return (
    await getClient((client) =>
      client.query(
        `DELETE FROM "config" WHERE "id"='${configId}' RETURNING "id"`
      )
    )
  ).rows[0];
};

export const updateConfig = async (configId: number, token: string) => {
  const config = (
    await getClient((client) =>
      client.query(
        `UPDATE "config" SET "token"='${token}' WHERE "id"='${configId}' RETURNING "id"`
      )
    )
  ).rows[0];
  return config.id;
};

export const fetchNotice = async (noticeId: string) => {
  const result = await query(`SELECT * FROM "notice" WHERE "id"='${noticeId}' LIMIT 1`); // getAllColumnsByCondition("notice", `"id"='${noticeId}'`);
  return result[0];
};

// export const fetchNotices = async (noticeId: string) => {
//   const result = await getAllColumnsByCondition("notice", `"id"='${noticeId}'`);
//   return result[0];
// };

// export const fetchConfig = async (
//   serviceId: string,
//   noticeId: string
// ): Promise<IServiceSchema[]> => {
//   return Promise.all(
//     services.map(async (service) => {
//       const serviceId = await getIdByCondition(
//         "service",
//         `"key"=${service.key}`
//       );
//       return {
//         ...service,
//         actions: await Promise.all(
//           service.actions.map(async (action) => {
//             const [queries, values, actionId] = (await Promise.all([
//               getAllColumnsByCondition(
//                 "notice_query",
//                 `"notice_id"='${noticeId}'`
//               ),
//               getAllColumnsByCondition(
//                 "notice_value",
//                 `"notice_id"='${noticeId}'`
//               ),
//               getIdByCondition(
//                 "action",
//                 `"key"=${action.key} AND "service_id"='${serviceId}'`
//               ),
//             ])) as [INoticeQuery[], INoticeValue[], number];

//             return {
//               ...action,
//               id: actionId,
//               queries: action.queries.map((query) => ({
//                 ...query,
//                 ...(queries.find((q) => q.default_key === query.default_key) ??
//                   {}),
//               })),
//               values: action.values.map((query) => ({
//                 ...query,
//                 ...(values.find((v) => v.key === query.key) ?? {}),
//               })),
//             };
//           })
//         ),
//         id: serviceId,
//       };
//     })
//   );
// };
