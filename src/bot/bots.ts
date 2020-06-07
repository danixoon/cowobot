import * as vk from "vk-io";


export interface IBot {
  target: ITargetBot;
  token: string;
  restart(): void;
  stop(): void;
}

export interface ITargetBot {
  send(targetId: string, content: string): void;
}

export interface INoticeBotData {
  action: { key: string; values: INoticeValue[]; queries: INoticeQuery[] };
  messageTemplate: string;
  targetKey: string | null;
}

type INoticeQueryMap = { key: string; value: string };

export abstract class Bot implements IBot {
  target: ITargetBot;
  token: string;
  configId: string;
  notices: INoticeBotData[];
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
    notice.action.values.find((value) => value.key === "target_id").value
  );
};

export class TelegramBot extends Bot {
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

export class VkBot extends Bot {
  bot: vk.VK;

  async stop() {
    if (this.bot) this.bot.updates.stop();
  }

  async restart() {
    if (this.bot) await this.bot.updates.stop();

    // await this.bot.updates.
    this.bot = new vk.VK({ token: this.token });

    this.notices.forEach((notice) => {
      switch (notice.action.key) {
        case "group_message":
          this.bot.updates.on("message", (context, next) => {
            const targetId = getTargetId(notice);
            const queryMap: INoticeQueryMap[] = notice.action.queries.map(
              (query) => {
                switch (query.key) {
                  case "content":
                    return { key: query.key, value: context.text };
                  case "username":
                    return { key: query.key, value: context.peerId.toString() };
                  default:
                    return { key: null, value: null };
                }
              }
            );
            const message = parseTemplate(notice.messageTemplate, queryMap);
            this.target.send(targetId, message);
            next();
          });
          break;
      }
    });

    // this.bot.updates.on("message", (context, next) => {

    // });

    this.bot.updates.start().catch(console.error);
    console.log("VK bot restarted.");
  }
  handle(action: string) {}
}
