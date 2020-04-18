import * as dotenv from "dotenv";

let isLoaded = false;

export const loadConfig = (type: "production" | "development") => {
  if (isLoaded) throw new Error("Config already loaded");
  const config = dotenv.config({ path: `config/.env.${type}` });
  if (config.error) throw config.error;
};
