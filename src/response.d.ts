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
      usename: string;
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

declare type ApiError = Partial<{
  message: string;
  statusCode: number;
  param: string;
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
