"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
exports.nodeEnvType = {
    production: "production",
    development: "development",
};
var isLoaded = false;
exports.getEnv = function () {
    var env = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        env[_i] = arguments[_i];
    }
    var result = {};
    for (var _a = 0, env_1 = env; _a < env_1.length; _a++) {
        var key = env_1[_a];
        var value = process.env[key];
        if (typeof value === "undefined")
            throw new Error("Env <" + key + "> not provided");
        result[key] = value;
    }
    return result;
};
exports.loadConfig = function (type) {
    if (isLoaded)
        throw new Error("Config already loaded");
    if (!type) {
        var NODE_ENV = exports.getEnv("NODE_ENV").NODE_ENV;
        if (NODE_ENV !== "production" && NODE_ENV !== "development")
            throw new Error("Invalid NODE_ENV value");
        type = NODE_ENV;
    }
    var config = dotenv.config({ path: "config/.env." + type });
    if (config.error)
        throw config.error;
    isLoaded = true;
};
