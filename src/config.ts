import * as dotenv from "dotenv";

export const nodeEnvType = {
  production: "production" as const,
  development: "development" as const,
};

let isLoaded = false;

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export const getEnv = <T extends string[] = string[]>(
  ...env: T
): { [K in ElementType<T>]: string } => {
  const result = {} as any;
  for (const key of env) {
    const value = process.env[key];
    if (typeof value === "undefined")
      throw new Error(`Env <${key}> not provided`);
    result[key] = value;
  }
  return result;
};

export const loadConfig = (
  type?: typeof nodeEnvType[keyof typeof nodeEnvType]
) => {
  if (isLoaded) throw new Error("Config already loaded");
  if (!type) {
    const { NODE_ENV } = getEnv("NODE_ENV");
    if (NODE_ENV !== "production" && NODE_ENV !== "development")
      throw new Error("Invalid NODE_ENV value");
    type = NODE_ENV;
  }
  const config = dotenv.config({ path: `config/.env.${type}` });
  if (config.error) throw config.error;
  isLoaded = true;
};
