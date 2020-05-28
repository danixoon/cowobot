"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var config_1 = require("./config");
var api_1 = require("./routes/api");
config_1.loadConfig();
var _a = config_1.getEnv("PORT", "NODE_ENV"), PORT = _a.PORT, NODE_ENV = _a.NODE_ENV;
var app = express();
if (NODE_ENV === config_1.nodeEnvType.production) {
    app.use("/", express.static(path.resolve(__dirname, "../client/build")));
}
app.use("/api", api_1.default);
app.listen(PORT, function () {
    console.log("Server is listening on port " + PORT);
});
