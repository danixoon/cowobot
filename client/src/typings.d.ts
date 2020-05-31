declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType[number];

declare namespace ActionMap {
  type ActionTypes = import("./redux/types").ActionNames;
  type ActionCreators = import("./redux/types").ActionCreators;

  export type ActionType = ActionTypes[keyof ActionTypes];
  export type Actions = ReturnType<ActionCreators[keyof ActionCreators]>;
  export type Action<T extends ActionType> = Extract<Actions, { type: T }>;
}

declare type StateSchema<T> = {
  status: DataStatus;
  error: ApiError | null;
  data: T | null;
};

declare type DataStatus = "idle" | "loading" | "success" | "error";
