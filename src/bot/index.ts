import {
  getAllColumnsByCondition,
  getClient,
  DBSchema,
  getActionByNoticeId,
  fetchNoticeWithData,
  getColumnsByCondition,
  query,
} from "../db";
import { INoticeBotData, IBot, Bot, VkBot } from "./bots";

type INoticeWithData = INotice & {
  values: INoticeValue[];
  queries: INoticeQuery[];
  targetKey: string | null;
};

type IBotData = {
  notices: INoticeBotData[];
  token: string | null;
  serviceKey: string;
  configId: number;
};

export const botMap = new Map<string, Bot>();

export const fetchBotData = async (configId: number): Promise<IBotData> => {
  const config = (
    await query(`SELECT * FROM "config" WHERE "id"='${configId}' LIMIT 1`)
  )[0];
  if (!config) throw new Error("Invalid configId");

  const notices = await query(
    `SELECT * FROM "notice" WHERE "config_id"='${config.id}'`
  );
  const serviceKey = await query(
    `SELECT "key" FROM "service" WHERE "id"='${config.service_id}' LIMIT 1`
  );

  if (serviceKey.length === 0)
    throw new Error(`invalid service on config <${config.id}>`);

  return {
    token: config.token,
    configId: config.id,
    serviceKey: serviceKey[0].key,
    notices: await Promise.all(
      notices.map(async (notice: DBSchema.INotice) => {
        const action = await getActionByNoticeId(notice.id);
        if (!action) throw new Error(`invalid action of notice <${notice.id}>`);
        const noticeData = (await fetchNoticeWithData(
          notice.id
        )) as INoticeWithData;
        const actionData: INoticeBotData["action"] = {
          queries: noticeData.queries,
          values: noticeData.values,
          key: action.key,
        };
        return {
          action: actionData,
          messageTemplate: noticeData.messageTemplate,
          targetKey: noticeData.targetKey,
        } as INoticeBotData;
      })
    ),
  };
};

export const deleteBot = async (configId: number) => {
  const bot = botMap.get(configId.toString());
  if (bot) {
    bot.stop();
    botMap.delete(configId.toString());
  } else throw new Error(`bot for config <${configId}> not started`);
};

export const startBot = async (configId: number) => {
  const data = await fetchBotData(configId);
  let bot: Bot;
  switch (data.serviceKey) {
    case "vk":
      bot = new VkBot(data.token, data.notices, {
        send: (targetId, content) => {
          console.log(`message <${content}> sended to <${targetId}>`);
        },
      });
      break;
    default:
      console.log(`bot for service <${data.serviceKey}> not provided`);
      return;
    // case "telegram"
  }

  botMap.set(data.configId.toString(), bot);
  console.log(`bot for config <${data.configId}> setted.`);
  bot.restart();
};

export const restartBot = async (configId: number) => {
  const bot = botMap.get(configId.toString());
  if (bot) {
    const data = await fetchBotData(configId);
    bot.notices = data.notices;
    bot.token = data.token;
    // bot.target = data.
    bot.restart();
  } else throw new Error(`bot for config <${configId}> not started`);
};

export const setupBots = async () => {
  const configs = (
    await getClient((client) => client.query(`SELECT * FROM "config"`))
  ).rows;

  if (configs.length === 0) return console.log("No configs found");

  // const botData = await Promise.all(
  //   configs.map(async (config: DBSchema.IConfig) => fetchBotData(config.id))
  // );
  // // .flat()

  // botData.forEach((data) => {
  //   startBot(config)
  // });

  configs.forEach((config: DBSchema.IConfig) => {
    startBot(config.id);
  });

  // console.log(botData);
  // const data: INoticeBotData[] =
};
