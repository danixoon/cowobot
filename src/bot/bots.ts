import * as vk from "vk-io";
import { ActionHandler } from ".";

export interface IBot {
  target: ITargetBot;
  token: string;

  restart(): void;
  stop(): void;
}

export interface ITargetBot {
  send(targetId: string, content: string): void;
}
export interface IActionBotData {
  key: string;
  values: INoticeValue[];
  queries: INoticeQuery[];
}

export interface INoticeBotData {
  action: IActionBotData;
  messageTemplate: string;
  targetKey: string | null;
}

type INoticeQueryMap = { key: string; value: string };

export abstract class Bot<T = any> implements IBot {
  bot: T;
  target: ITargetBot;
  token: string;
  configId: string;
  notices: INoticeBotData[];
  parser: ActionHandler<any>[] = [];
  constructor(token: string, notices: INoticeBotData[], target: ITargetBot) {
    this.token = token;
    this.notices = notices;
    this.target = target;
    // this.
  }
  abstract restart(): void;
  abstract handle(action: string): void;
  abstract stop(): void;
}

export const parseTemplate = (template: string, queries: INoticeQueryMap[]) => {
  let result = template;
  queries.forEach((query) => {
    result = result.replace(`\${${query.key}}`, query.value);
  });
  return result;
};

export const getTargetId = (notice: INoticeBotData) => {
  return (
    notice.targetKey ??
    notice.action.values.find((value) => value.key.endsWith("target_id")).value
  );
};

export class TelegramBot extends Bot<TelegramBot> {
  restart() {}
  handle(action: string) {}
  stop() {}
}

// const targetBot: ITargetBot = new TelegramBot(TELEGRAM_TOKEN);

// export const getNoticeQueries = (
//   notice: INoticeBotData,
// ): INoticeQueryMap[] => {
//   return notice.action.queries.map((query) => ({ key: query.key, value: query. }));
// };

// const vkActionsParser: [ActionParser<vk.VK, vk.MessageContext>] = [
//   {
//     key: "group_message",
//     parser: {
//       content: (bot, context, values) => context.text,
//       username: async (bot, context, values) => {
//         const [user] = await bot.auth.users.get({
//           user_ids: [context.peerId.toString()],
//         });
//         return `${user.first_name} ${user.last_name}`;
//       },
//       url: async (bot, context, values) => {
//         return `https://vk.com/gim${values.group_id}?sel=${context.peerId}`;
//       },
//     },
//   },
// ];

const handleNotice = async <T>(
  notice: INoticeBotData,
  handler: ActionHandler<T>,
  context: T
): Promise<string> => {
  const values = notice.action.values.reduce(
    (acc, v) => ({ ...acc, [v.key]: v }),
    {}
  );
  const queries: INoticeQueryMap[] = await Promise.all(
    notice.action.queries.map(async (query) => ({
      key: query.key,
      value: await (
        handler.parser[`${query.key.split(".")[1]}`] ?? (() => "")
      )(context, values),
    }))
  );
  const message = parseTemplate(notice.messageTemplate, queries);
  return message;
};

export class VkBot extends Bot<vk.VK> {
  bot: vk.VK;
  parser: [ActionHandler<vk.MessageContext>] = [
    {
      key: "group_message",
      parser: {
        content: (context, values) => context.text,
        username: async (context, values) => {
          const [user] = await this.bot.api.users.get({
            user_ids: [context.peerId.toString()],
          });
          return `${user.first_name} ${user.last_name}`;
        },
        url: async (context, values) => {
          return `https://vk.com/gim${values.group_id}?sel=${context.peerId}`;
        },
      },
    },
  ];

  async stop() {
    if (this.bot) this.bot.updates.stop();
  }

  async restart() {
    if (this.bot) await this.bot.updates.stop();

    // await this.bot.updates.
    this.bot = new vk.VK({ token: this.token });

    this.notices.forEach((notice) => {
      switch (notice.action.key) {
        case "group_message": {
          this.bot.updates.on("message", async (context, next) => {
            const targetId = getTargetId(notice);
            const message = await handleNotice(
              notice,
              this.parser.find((p) => p.key === notice.action.key),
              context
            );
            this.target.send(targetId, message);
            next();
          });
          break;
        }
        case "group_post": {
          this.bot.updates.on("new_wall_post", async (context, next) => {
            const targetId = getTargetId(notice);
            const queryMap: INoticeQueryMap[] = await Promise.all(
              notice.action.queries.map(async (query) => {
                switch (query.key) {
                  case "group_post.content":
                    return {
                      key: query.key,
                      value: context.wall.text,
                    };
                  case "group_post.url": {
                    const groupId = Math.abs(context.wall.ownerId);
                    return {
                      key: query.key,
                      value: `https://vk.com/public${groupId}?w=wall-${groupId}_${context.wall.id.toString()}`,
                    };
                  }
                  default:
                    return { key: null, value: null };
                }
              })
            );
            const message = parseTemplate(notice.messageTemplate, queryMap);
            this.target.send(targetId, message);
            next();
          });
        }
        // case "group_post"
      }
    });

    // this.bot.updates.on("message", (context, next) => {

    // });

    this.bot.updates.start().catch(console.error);
    console.log("VK bot restarted.");
  }
  handle(action: string) {}
}
