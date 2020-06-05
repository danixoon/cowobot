declare type SessionRequest = import("express").Request & {
  session: { userId?: number };
};
