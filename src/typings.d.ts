declare type SessionRequest = import("express").Request & {
  session: { userId?: string };
};
