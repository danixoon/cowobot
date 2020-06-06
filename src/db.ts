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

type INoticeValue = {
  name: string;
  key: string;
  value: string;
};
type INoticeQuery = {
  name: string;
  custom_key: string;
  key: string;
};

type IAction = {
  id: number;
  name: string;
  key: string;
  values: INoticeValue[];
  queries: INoticeQuery[];
};

type IServiceSchema = {
  id: number;
  name: string;
  key: string;
  role: number;
  actions: IAction[];
};

// const noticeDataMap = new Map()
enum ServiceRole {
  Messenger = 1 << 1,
  Event = 1 << 2,
}

const services: IServiceSchema[] = [
  {
    id: 0,
    name: "Вконтакте",
    key: "vk",
    role: ServiceRole.Event | ServiceRole.Messenger,
    actions: [
      {
        id: 0,
        name: "Новый пост",
        key: "post_new",
        values: [
          {
            name: "Ид. группы",
            key: "group_id",
            value: "",
          },
        ],
        queries: [
          {
            name: "Содержимое поста",
            custom_key: "",
            key: "content",
          },
        ],
      },
      {
        id: 0,
        name: "Новый комментарий",
        key: "post_comment_new",
        queries: [],
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
    .find((service) => (service.key = serviceKey))
    .actions.find((action) => action.key === actionKey);
};

export const getActionByNoticeId = async (noticeId: number) => {
  const { serviceKey, actionKey } = (
    await getClient((client) =>
      client.query(`
  SELECT "action"."key" AS "actionKey", "service"."key" AS "serviceKey" FROM "notice"
  INNER JOIN "config" ON "config"."id"="notice"."config_id"
  INNER JOIN "action" ON "action"."id"="notice"."action_id"
  INNER JOIN "service" ON "service"."id"="config"."service_id"
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
  returns: string | undefined = "*"
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
        services.map((v) => `DEFAULT, '${v.name}', '${v.key}', '${v.role}'`)
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
        )
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

  return services.rows;
};

// Возвращает все идентификаторы оповещений, привязанных к конфигу configId
export const fetchNotices = async (configId: number) => {
  const notices = await getAllColumnsByCondition(
    "notice",
    `"config_id"='${configId}'`
  );

  return notices;
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

// Возвращает данные по оповещению
export const fetchNoticeData = async (noticeId: number) => {
  const notice = (
    await getAllColumnsByCondition("notice", `"id"='${noticeId}'`)
  )[0];

  if (!notice) return null;

  const [values, queries] = (await Promise.all([
    getAllColumnsByCondition("notice_value", `"notice_id"='${noticeId}'`),
    getAllColumnsByCondition("notice_query", `"notice_id"='${noticeId}'`),
  ])) as any;

  const action = await getActionByNoticeId(noticeId);

  return {
    ...mapData(notice),
    values: mapData(mergeByKey(action.values, values)),
    queries: mapData(mergeByKey(action.queries, queries)),
  };

  // const

  // const mappedValues =

  // const config = await getAllColumnsByCondition("config", `"id"='${configId}'`);

  // return config[0];
};

export const createNotice = async (
  messageTemplate: string,
  configId: number,
  actionId: number
) => {
  const serviceId = (
    await getColumnsByCondition("config", ["service_id"], `"id"='${configId}'`)
  )[0].service_id;
  const notice = (
    await getClient((client) =>
      client.query(
        getInsertQuery("notice", [
          `DEFAULT, '${messageTemplate}', '${configId}', '${actionId}', '${serviceId}'`,
        ])
      )
    )
  ).rows[0];
  return notice.id;
};

export const updateNotice = async (
  noticeId: number,
  messageTemplate: string
) => {
  await getClient((client) =>
    client.query(
      `UPDATE "notice" SET "message_template"='${messageTemplate}' WHERE "id"='${noticeId}'`
    )
  );
};

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
          }', '${noticeId}'`
      ),
      `"id"`
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
      ),
      `"id"`
    ) +
    `ON CONFLICT ("key", "notice_id") DO UPDATE SET "value" = excluded."value"`;

  const query: string[] = [];

  if (queries.length > 0) query.push(query1);
  if (values.length > 0) query.push(query2);

  await getClient((client) => client.query(query.join("; ")));

  // )`INSERT INTO "notice_query" (machine_id, machine_name)VALUES (1, 1, 'test_machine')
  // ON DUPLICATE KEY UPDATE machine_name=VALUES(machine_name);`;
};

export const createConfig = async (accountId: number, serviceId: number) => {
  const config = (
    await getClient((client) =>
      client.query(
        getInsertQuery("config", [
          `DEFAULT, NULL, '${accountId}', '${serviceId}'`,
        ])
      )
    )
  ).rows[0];
  return config;
};

export const updateConfig = async (configId: number, token: string) => {
  const config = (
    await getClient((client) =>
      client.query(
        `UPDATE "config" SET "token"='${token}' WHERE "id"='${configId}'`
      )
    )
  ).rows[0];
  return config.id;
};

export const fetchNotice = async (noticeId: string) => {
  const result = await getAllColumnsByCondition("notice", `"id"='${noticeId}'`);
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
