declare interface IService {
  id: number;
  key: string;
  name: string;
  role: number;
}

declare interface IAction {
  id: number;
  name: string;
  key: string;
  serviceId: number;
}

declare interface IAccount {
  id: number;
  username: string;
  // password: string;
  nickname: string;
  serviceId: number;
}

declare interface IConfig {
  id: number;
  token: string;
  accountId: number;
  serviceId: number;
}

declare interface INotice {
  id: number;
  messageTemplate: string;
  configId: number;
  actionId: number;
  serviceId: number;
}

declare interface INoticeValue {
  id: number;
  name: string;
  key: string;
  value: string;
  noticeId: number;
}

declare interface INoticeQuery {
  id: number;
  name: string;
  key: string;
  customKey: string;
  noticeId: number;
}

declare namespace ApiResponseData {
  export namespace Service {
    export type Service = {
      serviceId: number;
      name: string;
    };

    export type Notice = {
      noticeId: number;
      variableId: number;
      actionId: number;
      messageTemplate: string;
    };

    export type Action = {
      actionId: number;
      name: string;
      variables: {
        variableId: number;
        localId?: string;
        actionId: number;
        value: string;
        name: string;
      }[];
    };

    export type Variable = {
      variableId: number;
      name: string;
      customKey: string | null;
      defaultKey: string;
      isTarget: boolean;
      type: string;
    };
  }

  export namespace Account {
    export type User = {
      username: string;
    };
  }
}

declare namespace ApiMap {
  export type GET = {
    "/services": { services: ApiResponseData.Service.Service[] };
    "/service/configs": number[];
    "/service/config": {
      variables: ApiResponseData.Service.Variable[];
      actions: ApiResponseData.Service.Action[];
      notices: ApiResponseData.Service.Notice[];
    };
  };
  export type POST = {
    "/service/config": { configId: number };
  };
  export type DELETE = {
    "/service/config": { configId: number };
  };
}

declare namespace ApiRequestData {
  export type PUT = {
    "/service/config": {
      configId: number;
      changes: {
        token: string;
        variables: Pick<
          ApiResponseData.Service.Variable,
          "variableId" | "customKey"
        >[];
        notices: (ApiResponseData.Service.Notice & {
          modified: "create" | "delete" | "update";
          variables: {
            variableId: number;
            value: string;
          }[];
        })[];
      };
    };
  };
}

declare type ApiError = Partial<{
  message: string;
  statusCode: number;
  param: string;
  randomId?: string;
  [key: string]: any;
}>;

declare type ApiSuccessReponse<T = any> = {
  error: null;
  data: T;
};

declare type ApiResponse<T = any> =
  | ApiSuccessReponse<T>
  | {
      error: ApiError;
    };
