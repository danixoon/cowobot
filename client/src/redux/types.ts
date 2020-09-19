export const getAction = <A extends keyof ActionPayload>(
  type: A,
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => ({ type, payload });

export const getActionCreator = <A extends keyof ActionPayload>(type: A) => (
  payload: ActionPayload[A] = {} as ActionPayload[A]
) => getAction(type, payload);

export const ActionTypes = new Proxy<{ [K in keyof ActionPayload]: K }>(
  {} as any,
  {
    get(target, prop) {
      return prop;
    },
  }
);

export type UserState = StateSchema<
  {
    username: string;
    isAuth: boolean;
  },
  "login" | "logout" | "fetch"
>;

export type ServiceState = StateSchema<
  {
    serviceView: ServiceConfigView;
    serviceId: number;
    services: IServiceWithAction[];
  },
  "fetch"
>;

export type ConfigState = StateSchema<
  IConfig & {
    isEmpty: boolean;
  },
  "create" | "delete" | "fetch" | "update"
>;

export enum QueryRole {
  Messenger = 1 << 1,
  Text = 1 << 2,
}

export type NoticeState = StateSchema<
  {
    notices: StateSchema<
      INoticeWithData,
      "fetch" | "delete" | "add" | "save"
    >[];
    // data: StateSchema<
    //   { values: INoticeValue[]; queries: INoticeQuery[] },
    //   "fetch"
    // >;
  },
  "fetch"
>;
// export type ServiceState = {
//   serviceId: number | null;
//   serviceView: ServiceConfigView;
//   services: StateSchema<ApiResponseData.Service.Service[]>;
//   config: StateSchema<{
//     token: string;
//     configId: number;
//     // Варианты событий (ревью не ревью)
//     actions: ApiResponseData.Service.Action[];
//     variables: ApiResponseData.Service.Variable[];
//     notices: ApiResponseData.Service.Notice[];
//   }>;
// };

export interface TestState {
  message: string;
}

export interface RootState {
  user: UserState;
  test: TestState;
  service: ServiceState;
  notice: NoticeState;
  config: ConfigState;
}
