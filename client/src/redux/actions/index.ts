import { ActionType } from "../types";
import { ApiError } from "../../api/user";

export * from "./user";

export const apiError = <T extends ActionType>(
  actionType: T,
  error: ApiError
) =>
  ({
    type: actionType,
    payload: { error },
  } as { type: T; payload: { error: ApiError } });
