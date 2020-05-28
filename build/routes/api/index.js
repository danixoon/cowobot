"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get("/test", function (req, res, next) {
    res.send({ ok: true });
    next();
});
exports.default = router;
