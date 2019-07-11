"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var server_1 = require("@bespoke/server");
var Controller_1 = require("./Controller");
var config_1 = require("./config");
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, '../static'));
